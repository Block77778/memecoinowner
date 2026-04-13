import { useState, useEffect, useCallback, FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios";
import { notify } from "../../utils/notifications";
import { ClipLoader } from "react-spinners";
import { useNetworkConfiguration } from "contexts/NetworkConfigurationProvider";
import { AiOutlineClose } from "react-icons/ai";
import { InputView } from "../index";
import CreateSVG from "../../components/SVG/CreateSVG";
import Branding from "../../components/Branding";
import { MdGeneratingTokens } from "react-icons/md";
import { IoCopyOutline, IoCheckmarkCircle } from "react-icons/io5";

const ADMIN_WALLET = "2un5Tv6ZBFU8Raw5tjxQrhcXsGe7UJ9it2tBzSRSUs7L";

type CreateViewProps = { setOpenCreateModal: (v: boolean) => void };

export const CreateView: FC<CreateViewProps> = ({ setOpenCreateModal }) => {
  // ─── Payment / Approval flow state ───────────────────────────────────────
  const savedHash =
    typeof window !== "undefined" ? localStorage.getItem("txHash") : "";
  const savedStep =
    typeof window !== "undefined" ? localStorage.getItem("step") : "payment";

  const [step, setStep] = useState<"payment" | "pending" | "approved">(
    (savedStep as "payment" | "pending" | "approved") || "payment"
  );
  const [txHash, setTxHash] = useState(savedHash || "");
  const [copied, setCopied] = useState(false);

  const updateStep = (s: "payment" | "pending" | "approved") => {
    setStep(s);
    localStorage.setItem("step", s);
  };

  const updateTxHash = (h: string) => {
    setTxHash(h);
    localStorage.setItem("txHash", h);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Poll backend for approval every 5 seconds
  useEffect(() => {
    if (step === "pending") {
      const interval = setInterval(async () => {
        const res = await fetch(`/api/status?txHash=${txHash}`);
        const data = await res.json();
        if (data.status === "approved") {
          localStorage.removeItem("step");
          localStorage.removeItem("txHash");
          updateStep("approved");
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [step, txHash]);

  const submitTx = async () => {
    if (!txHash.trim()) {
      alert("Please enter your transaction hash");
      return;
    }
    await fetch("/api/submit-tx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash }),
    });
    updateStep("pending");
  };

  // ─── Token creation state ─────────────────────────────────────────────────
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState({
    name: "",
    symbol: "",
    decimals: "",
    amount: "",
    image: "",
    description: "",
  });

  const handleFormFieldChange = (fieldName: string, e: any) => {
    setToken({ ...token, [fieldName]: e.target.value });
  };

  // Returns a string URL or throws — never returns void
  const uploadImagePinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: `4c1abdcc51b983d48932`,
        pinata_secret_api_key: `4320b65a52e1d0b93be2c2ccb5bea8ca87e58ef545c513af5c6031770c658dd7`,
        "Content-Type": "multipart/form-data",
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  };

  // Returns a string URL or throws — never returns void
  const uploadMetadata = async (token: any): Promise<string> => {
    setIsLoading(true);
    const { name, symbol, description, image } = token;
    if (!name || !symbol || !description || !image) {
      throw new Error("Data Missing");
    }
    const data = JSON.stringify({ name, symbol, description, image });
    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
        pinata_api_key: `4c1abdcc51b983d48932`,
        pinata_secret_api_key: `4320b65a52e1d0b93be2c2ccb5bea8ca87e58ef545c513af5c6031770c658dd7`,
        "Content-Type": "application/json",
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  };

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imgUrl = await uploadImagePinata(file);
        setToken({ ...token, image: imgUrl });
      } catch (error: any) {
        notify({ type: "error", message: "Upload image failed" });
      }
    }
  };

  const createToken = useCallback(
    async (token: any) => {
      if (!publicKey) {
        notify({ type: "error", message: "Wallet not connected" });
        return;
      }
      try {
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const mintKeypair = Keypair.generate();
        const tokenATA = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey
        );

        const metadataUrl = await uploadMetadata(token);

        const createMetadataInstruction =
          createCreateMetadataAccountV3Instruction(
            {
              metadata: PublicKey.findProgramAddressSync(
                [
                  Buffer.from("metadata"),
                  PROGRAM_ID.toBuffer(),
                  mintKeypair.publicKey.toBuffer(),
                ],
                PROGRAM_ID
              )[0],
              mint: mintKeypair.publicKey,
              mintAuthority: publicKey,
              payer: publicKey,
              updateAuthority: publicKey,
            },
            {
              createMetadataAccountArgsV3: {
                data: {
                  name: token.name,
                  symbol: token.symbol,
                  uri: metadataUrl,
                  creators: null,
                  sellerFeeBasisPoints: 0,
                  uses: null,
                  collection: null,
                },
                isMutable: false,
                collectionDetails: null,
              },
            }
          );

        const createNewTokenTransaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: lamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            Number(token.decimals),
            publicKey,
            publicKey,
            TOKEN_PROGRAM_ID
          ),
          createAssociatedTokenAccountInstruction(
            publicKey,
            tokenATA,
            publicKey,
            mintKeypair.publicKey
          ),
          createMintToInstruction(
            mintKeypair.publicKey,
            tokenATA,
            publicKey,
            Number(token.amount) * Math.pow(10, Number(token.decimals))
          ),
          createMetadataInstruction
        );

        const signature = await sendTransaction(
          createNewTokenTransaction,
          connection,
          { signers: [mintKeypair] }
        );

        setTokenMintAddress(mintKeypair.publicKey.toString());
        notify({
          type: "success",
          message: "Token creation successful",
          txid: signature,
        });
      } catch (error: any) {
        notify({ type: "error", message: error?.message || "Token creation failed" });
      }
      setIsLoading(false);
    },
    [publicKey, connection, sendTransaction]
  );

  // =========================================================================
  // 💰 STEP 1 — PAYMENT SCREEN
  // =========================================================================
  if (step === "payment") {
    return (
      <section className="flex min-h-screen w-full items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-default-950/40 rounded-2xl backdrop-blur-2xl border border-white/10 overflow-hidden">
            <div className="bg-primary/10 border-b border-white/10 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                  <MdGeneratingTokens size={20} />
                </span>
                <h4 className="text-lg font-bold text-white tracking-wide">
                  Create Solana Token
                </h4>
              </div>
              <button
                onClick={() => setOpenCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-all duration-300 hover:bg-white/20 hover:text-white"
              >
                <AiOutlineClose size={14} />
              </button>
            </div>

            <div className="p-8">
              <span className="text-primary bg-primary/20 mb-6 inline-block rounded-md px-3 py-1 text-xs font-medium uppercase tracking-wider">
                Step 1 — Payment
              </span>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Send SOL to unlock token creation
              </h2>
              <p className="text-default-300 mb-8 text-sm leading-relaxed">
                Transfer SOL to the address below, then paste your transaction
                hash to verify. Your token creator unlocks automatically once
                the payment is approved.
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Send SOL to this address
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <code className="flex-1 truncate font-mono text-sm text-white/80">
                    {ADMIN_WALLET}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition-all duration-300 hover:bg-primary/40"
                  >
                    {copied ? (
                      <>
                        <IoCheckmarkCircle size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <IoCopyOutline size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-widest text-white/30">then</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Paste your transaction hash
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5KtPnREhb2xYqF..."
                  value={txHash}
                  onChange={(e) => updateTxHash(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white/80 placeholder-white/20 outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/10"
                />
              </div>

              <button
                onClick={submitTx}
                disabled={!txHash.trim()}
                className="bg-primary/90 hover:bg-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MdGeneratingTokens size={18} />
                Submit Payment &amp; Continue
              </button>

              <p className="mt-4 text-center text-xs text-white/30">
                Your payment will be reviewed by the admin — usually under a minute.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // ⏳ STEP 2 — PENDING SCREEN
  // =========================================================================
  if (step === "pending") {
    return (
      <section className="flex min-h-screen w-full items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-default-950/40 rounded-2xl backdrop-blur-2xl border border-white/10 overflow-hidden">
            <div className="bg-primary/10 border-b border-white/10 px-8 py-5 flex items-center gap-3">
              <span className="bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                <MdGeneratingTokens size={20} />
              </span>
              <h4 className="text-lg font-bold text-white tracking-wide">
                Create Solana Token
              </h4>
            </div>

            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
              </div>
              <span className="text-primary bg-primary/20 mb-4 inline-block rounded-md px-3 py-1 text-xs font-medium uppercase tracking-wider">
                Awaiting Approval
              </span>
              <h2 className="mb-3 text-2xl font-bold text-white">
                Verifying your payment…
              </h2>
              <p className="text-default-300 mx-auto mb-8 max-w-sm text-sm leading-relaxed">
                Your transaction has been submitted and is being reviewed. This
                page checks automatically every 5 seconds — no action needed.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/40">
                  Transaction hash
                </p>
                <code className="block truncate font-mono text-sm text-white/70">
                  {txHash}
                </code>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
              </div>
              <p className="mt-3 text-xs text-white/30">Checking every 5 seconds…</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // ✅ STEP 3 — APPROVED → FULL TOKEN CREATOR
  // =========================================================================
  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}

      {!tokenMintAddress ? (
        <section className="flex h-full w-full items-center py-6 px-0 lg:p-10">
          <div className="container">
            <div className="bg-default-950/40 mx-auto max-w-5xl rounded-2xl backdrop-blur-2xl">
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="ps-4 hidden py-4 pt-10 lg:block">
                  <div className="upload relative w-full overflow-hidden rounded-xl">
                    {token.image ? (
                      <img src={token.image} alt="token" className="w-2/5" />
                    ) : (
                      <label htmlFor="file" className="custum-file-upload">
                        <div className="icon">
                          <CreateSVG />
                        </div>
                        <div className="text">
                          <span>Click to upload image</span>
                        </div>
                        <input id="file" onChange={handleImageChange} type="file" />
                      </label>
                    )}
                  </div>
                  <textarea
                    onChange={(e) => handleFormFieldChange("description", e)}
                    className="border-default-200 relative mt-48 block w-full rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                    rows={6}
                    placeholder="Description of your token..."
                  />
                </div>

                <div className="lg:ps-0 flex flex-col p-10">
                  <div className="pb6 my-auto">
                    <h4 className="mb-4 mt-48 lg:mt-0 text-2xl font-bold text-white">
                      Solana Token Creator
                    </h4>
                    <p className="text-default-300 mb-8 max-w-sm">
                      Kindly provide all the details about your token
                    </p>

                    <div className="text-start">
                      {token.image ? (
                        <div className="flex lg:hidden items-start justify-center">
                          <img src={token.image} className="w-2/5" alt="token" />
                        </div>
                      ) : (
                        <div className="messageBox">
                          <div className="fileUploadWrapper">
                            <label htmlFor="file-mobile">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                                <circle strokeWidth={20} stroke="#6c6c6c" fill="none" r={158.5} cy={168.5} cx={168.5} />
                                <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M167.759 79V259" />
                                <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M79 167.138H259" />
                              </svg>
                              <span className="tooltip">Add an image</span>
                            </label>
                            <input onChange={handleImageChange} type="file" id="file-mobile" name="file" />
                          </div>
                        </div>
                      )}

                      <textarea
                        onChange={(e) => handleFormFieldChange("description", e)}
                        className="border-default-200 mt-4 relative lg:hidden block w-full rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                        rows={3}
                        placeholder="Description of your token..."
                      />

                      <InputView name="Name" placeholder="Token name" clickhandle={(e) => handleFormFieldChange("name", e)} />
                      <InputView name="Symbol" placeholder="Token symbol" clickhandle={(e) => handleFormFieldChange("symbol", e)} />
                      <InputView name="Decimals" placeholder="Decimals" clickhandle={(e) => handleFormFieldChange("decimals", e)} />
                      <InputView name="Amount" placeholder="Total supply" clickhandle={(e) => handleFormFieldChange("amount", e)} />

                      <div className="mb-6 text-center">
                        <button
                          onClick={() => createToken(token)}
                          className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                          type="button"
                        >
                          <span className="fw-bold">Create Token</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <ul className="flex flex-wrap items-center justify-center gap-2">
                      <li>
                        <a
                          onClick={() => setOpenCreateModal(false)}
                          className="group inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-2xl transition-all duration-500 hover:bg-blue-600/60 cursor-pointer"
                        >
                          <AiOutlineClose />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex w-full items-center py-6 px-0 lg:h-screen lg:p-10">
          <div className="container">
            <div className="bg-default-950/40 mx-auto max-w-5xl overflow-hidden rounded-2xl backdrop-blur-2xl">
              <div className="grid gap-10 lg:grid-cols-2">
                <Branding
                  image="auth-img"
                  title="Launch Your Token on Solana"
                  message="Create and manage your Solana token in minutes — no code required. Visit memecoinowner.com to get started."
                />
                <div className="lg:ps-0 flex h-full flex-col p-10">
                  <div className="pb-10">
                    <a href="index.html" className="flex">
                      <img src={"assets/images/logo.png"} alt="dark logo" className="h-10" />
                    </a>
                  </div>
                  <div className="my-auto pb-6 text-center">
                    <h4 className="mb-4 text-2xl font-bold text-white">Link to your new token.</h4>
                    <p className="text-default-300 mx-auto mb-5 max-w-sm">
                      You have successfully created your Solana token.
                    </p>
                    <div className="flex items-start justify-center">
                      <img src={token.image || "assets/images/logo.png"} alt="" className="h-40" />
                    </div>
                    <div className="mt-5 w-full text-center">
                      <p className="text-default-300 text-base font-medium leading-6">
                        <InputView name="Token Address" placeholder={tokenMintAddress} />
                        <span className="cursor-pointer" onClick={() => navigator.clipboard.writeText(tokenMintAddress)}>
                          Copy
                        </span>
                      </p>
                      <div className="mb-6 text-center">
                        <a
                          href={`https://explorer.solana.com/address/${tokenMintAddress}?cluster=${networkConfiguration}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                        >
                          <span className="fw-bold">View On Solana</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CreateView;
