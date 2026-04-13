import { FC } from "react";
import pkg from "../../../package.json";
import { LuArrowRightFromLine } from "react-icons/lu";
import { MdGeneratingTokens, MdToken } from "react-icons/md";
import { RiTokenSwapFill } from "react-icons/ri";
import { RxTokens } from "react-icons/rx";

type FeatureViewProps = {
  setOpenCreateModal: (v: boolean) => void;
  setOpenTokenMetaData: (v: boolean) => void;
  setOpenContact: (v: boolean) => void;
  setOpenAirdrop: (v: boolean) => void;
  setOpenSendTransaction: (v: boolean) => void;
};
export const FeatureView: FC<FeatureViewProps> = ({
  setOpenTokenMetaData,
  setOpenContact,
  setOpenAirdrop,
  setOpenSendTransaction,
  setOpenCreateModal,
}) => {
  const feature = [
    {
      name: "Token Generator",
      icon: <MdGeneratingTokens />,
      description:
        "Launch your own Solana token in minutes. Set your name, symbol, supply, and decimals — then deploy straight to the Solana blockchain with one click.",
      function: setOpenCreateModal,
    },
    {
      name: "Get Airdrop",
      icon: <MdToken />,
      description:
        "Claim free devnet SOL instantly to test your tokens and transactions. Perfect for experimenting before going live on mainnet.",
      function: setOpenAirdrop,
    },
    {
      name: "Transfer Sol",
      icon: <RiTokenSwapFill />,
      description:
        "Send SOL to any wallet address quickly and securely. Track your transactions in real time directly from your dashboard.",
      function: setOpenSendTransaction,
    },
    {
      name: "Metadata Token",
      icon: <RxTokens />,
      description:
        "Update your token's metadata on-chain — change the name, symbol, URI, or image anytime. Keep your token's identity fresh and professional.",
      function: setOpenTokenMetaData,
    },
  ];
  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Everything You Need to Launch on Solana
            </h2>
            <p className="text-default-200 text-sm font-medium">
              MemecoinOwner gives you the tools to create, deploy, and manage <br />
              your Solana token — all without writing a single line of code.
            </p>
          </div>
        </div>

        <div className="bg-default-950/40 flex flex-wrap items-center rounded-3xl backdrop-blur-3xl">
          {feature.map((list, index) => (
            <div
              key={list.name}
              className={` w-auto grow border-b border-white/10  md:w-1/2
              ${
                index == 0
                  ? "md:border-e   "
                  : index == 1
                  ? " "
                  : index == 2
                  ? "md:border-e md:border-b-0"
                  : " "
              } `}
            >
              <div className="p-8 sm:p-10">
                <div className="bg-primary/10 text-primary mb-10 inline-flex h-16 w-16 items-center justify-center rounded-xl">
                  <i data-lucide="framer" className="">
                    {list.icon}
                  </i>
                </div>
                <h2 className="mb-4 text-2xl font-medium text-white">
                  {list.name}
                </h2>
                <p className="text-default-200 mb-6 text-base">
                  {list.description}
                </p>
                <a
                  onClick={() => list.function(true)}
                  className="hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-2 text-white transition-all duration-300"
                >
                  More Tools{" "}
                  <i data-lucide="move-right" className="">
                    <LuArrowRightFromLine />
                  </i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
