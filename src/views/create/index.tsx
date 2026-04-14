import { useState, useEffect, useCallback, FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
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
import { IoCheckmarkCircle, IoWalletOutline } from "react-icons/io5";

const ADMIN_WALLET = "2un5Tv6ZBFU8Raw5tjxQrhcXsGe7UJ9it2tBzSRSUs7L";
const FEE_SOL = 1;

type CreateViewProps = { setOpenCreateModal: (v: boolean) => void };

export const CreateView: FC<CreateViewProps> = ({ setOpenCreateModal }) => {
  // ─── Payment / Approval flow state ───────────────────────────────────────
  const [step, setStep] = useState<"payment" | "paying" | "approved">("payment");
  const [payError, setPayError] = useState("");

  // ─── Token creation state ─────────────────────────────────────────────────
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  // ─── Direct wallet payment ────────────────────────────────────────────────
  const handlePayNow = useCallback(async () => {
    if (!publicKey) {
      setPayError("Please connect your wallet first.");
      return;
    }
    setPayError("");
    setStep("paying");
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(ADMIN_WALLET),
          lamports: LAMPORTS_PER_SOL * FEE_SOL,
        })
      );
      const signature = await sendTransaction(transaction, connection);
      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");
      notify({ type: "success", message: "Payment confirmed!", txid: signature });
      setStep("approved");
    } catch (error: any) {
      notify({ type: "error", message: error?.message || "Payment failed" });
      setStep("payment");
      setPayError(error?.message || "Transaction failed. Please try again.");
    }
  }, [publicKey, sendTransaction, connection]);

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
  if (step === "payment" || step === "paying") {
    return (
      <section className="flex min-h-screen w-full items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-default-950/40 rounded-2xl backdrop-blur-2xl border border-white/10 overflow-hidden">
            {/* Header */}
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
                Step 1 — Unlock Token Creator
              </span>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Send 1 SOL to instantly create your coin
              </h2>
              <p className="text-default-300 mb-8 text-sm leading-relaxed">
                Transfer 1 SOL to the address below. Your token creator unlocks automatically once the payment is confirmed on-chain — no waiting, no manual approval.
              </p>

              {/* Fee breakdown */}
              <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Platform fee</span>
                  <span className="text-white font-medium">{FEE_SOL} SOL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Recipient</span>
                  <code className="text-white/60 font-mono text-xs truncate max-w-[220px]">{ADMIN_WALLET}</code>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-primary">{FEE_SOL} SOL</span>
                </div>
              </div>

              {/* Wallet connect button */}
              {!publicKey && (
                <div className="mb-4 flex flex-col items-center gap-3">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Connect your wallet to continue</p>
                  <WalletMultiButton />
                </div>
              )}

              {/* Pay button */}
              {publicKey && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 flex items-center gap-2 mb-4">
                  <IoCheckmarkCircle className="text-green-400 shrink-0" size={16} />
                  <span className="text-white/70 font-mono text-xs truncate">{publicKey.toBase58()}</span>
                </div>
              )}

              <button
                onClick={handlePayNow}
                disabled={!publicKey || step === "paying"}
                className="bg-primary/90 hover:bg-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === "paying" ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Confirming payment…
                  </>
                ) : (
                  <>
                    <IoWalletOutline size={18} />
                    Pay {FEE_SOL} SOL &amp; Continue
                  </>
                )}
              </button>

              {payError && (
                <p className="mt-3 text-center text-xs text-red-400">{payError}</p>
              )}

              <p className="mt-4 text-center text-xs text-white/30">
                Payment is confirmed on-chain instantly — no admin approval needed.
              </p>
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
