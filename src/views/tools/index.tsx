import { FC } from "react";
import { MdGeneratingTokens } from "react-icons/md";
import { RxTokens } from "react-icons/rx";
import { LuArrowRightFromLine } from "react-icons/lu";

type ToolViewProps = {
  setOpenCreateModal: (v: boolean) => void;
  setOpenTokenMetaData: (v: boolean) => void;
};

export const ToolView: FC<ToolViewProps> = ({
  setOpenCreateModal,
  setOpenTokenMetaData,
}) => {
  const tools = [
    {
      name: "Create Token",
      description: "Launch your own Solana token in 60 seconds. Choose a name, symbol, supply amount — then create in a single click. Your token will be instantly ready for use.",
      icon: <MdGeneratingTokens size={22} />,
      color: "text-primary",
      bg: "bg-primary/10",
      cta: "Create Coin",
      function: setOpenCreateModal,
    },
    {
      name: "Update Coin",
      description: "Update your coin with us — such as the name, symbol, and other details as needed, anytime, free.",
      icon: <RxTokens size={22} />,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      cta: "Update Now",
      function: setOpenTokenMetaData,
    },
  ];

  return (
    <section id="tools" className="py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-medium capitalize text-white">
            Create or Update your Coin.
          </h2>
          <p className="text-default-200 text-sm font-medium">
            Create a new coin or update an existing coin.<br />
            No code, no complexity.
          </p>
        </div>

        <div className="mx-auto max-w-3xl grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              onClick={() => tool.function(true)}
              className="bg-default-950/40 rounded-xl backdrop-blur-3xl border border-white/10 cursor-pointer transition-all duration-300 hover:border-primary/40 hover:bg-white/5"
            >
              <div className="p-8">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tool.bg} ${tool.color} mb-6`}>
                  {tool.icon}
                </div>
                <h3 className="text-white text-xl font-semibold mb-3">{tool.name}</h3>
                <p className="text-default-300 text-sm mb-6 leading-relaxed">{tool.description}</p>
                <a className={`${tool.color} group relative inline-flex items-center gap-2 text-sm font-medium`}>
                  <span className="bg-current absolute -bottom-0 h-px w-7/12 rounded opacity-50 transition-all duration-500 group-hover:w-full" />
                  {tool.cta} <LuArrowRightFromLine size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
