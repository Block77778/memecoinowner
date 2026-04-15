import { FC } from "react";
import { LuArrowRightFromLine } from "react-icons/lu";
import { MdGeneratingTokens } from "react-icons/md";
import { RxTokens } from "react-icons/rx";

type FeatureViewProps = {
  setOpenCreateModal: (v: boolean) => void;
  setOpenTokenMetaData: (v: boolean) => void;
};

export const FeatureView: FC<FeatureViewProps> = ({
  setOpenTokenMetaData,
  setOpenCreateModal,
}) => {
  const feature = [
    {
      name: "Create Token",
      icon: <MdGeneratingTokens size={28} />,
      description:
        "Launch your own Solana token in 60 seconds. Choose a name, symbol, supply amount — then create in a single click. Your token will be instantly ready for use.",
      cta: "Create Coin",
      function: setOpenCreateModal,
    },
    {
      name: "Update Coin",
      icon: <RxTokens size={28} />,
      description:
        "Update your coin with us — such as the name, symbol, and other details as needed, anytime, free.",
      cta: "Update Now",
      function: setOpenTokenMetaData,
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-medium capitalize text-white">
            Everything You Need To Launch a Coin
          </h2>
          <p className="text-default-200 text-sm font-medium">
            MemeCoinOwner is an online all in one tool to create<br />
            and manage your own crypto coin.
          </p>
        </div>

        <div className="bg-default-950/40 mx-auto max-w-3xl flex flex-wrap items-center rounded-3xl backdrop-blur-3xl">
          {feature.map((list, index) => (
            <div
              key={list.name}
              className={`w-full md:w-1/2 border-b border-white/10 ${index === 0 ? "md:border-e md:border-b-0" : "md:border-b-0"}`}
            >
              <div className="p-8 sm:p-10">
                <div className="bg-primary/10 text-primary mb-10 inline-flex h-16 w-16 items-center justify-center rounded-xl">
                  {list.icon}
                </div>
                <h2 className="mb-4 text-2xl font-medium text-white">
                  {list.name}
                </h2>
                <p className="text-default-200 mb-6 text-base">
                  {list.description}
                </p>
                <a
                  onClick={() => list.function(true)}
                  className="hover:bg-primary-hover inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-2 text-white transition-all duration-300"
                >
                  {list.cta} <LuArrowRightFromLine />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
