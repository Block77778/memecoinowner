import { FC } from "react";

export const FaqView: FC = () => {
  const question = [
    {
      question: "What is MemecoinOwner?",
      answer:
        "MemecoinOwner is a no-code platform for creating and managing Solana tokens. Whether you're launching a memecoin or a utility token, our tools let you deploy to the Solana blockchain in minutes — no programming knowledge needed.",
      id: "faq-1",
    },
    {
      question: "Do I need to know how to code to use MemecoinOwner?",
      answer:
        "Not at all. MemecoinOwner is built specifically for non-developers. Simply connect your Solana wallet, fill in your token details, and we handle all the on-chain transactions for you.",
      id: "faq-2",
    },
    {
      question: "Which wallets are supported?",
      answer:
        "We support all major Solana wallets including Phantom, Solflare, Backpack, and Ledger hardware wallets. Simply click 'Select Wallet' to connect and get started.",
      id: "faq-3",
    },
    {
      question: "Can I update my token's metadata after it's created?",
      answer:
        "Yes. Our Token Metadata tool lets you update your token's name, symbol, description, image, and URI on-chain at any time — as long as you have the mint authority.",
      id: "faq-4",
    },
    {
      question: "Is there a fee to create a token?",
      answer:
        "Creating a token requires a small amount of SOL to cover Solana network (gas) fees. There is no additional platform fee charged by MemecoinOwner beyond what the Solana network requires.",
      id: "faq-5",
    },
    {
      question: "What is the Airdrop feature for?",
      answer:
        "The Airdrop tool lets you claim free SOL on Solana's devnet so you can test token creation and transactions risk-free before going live on mainnet.",
      id: "faq-6",
    },
  ];
  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-default-200 text-sm font-medium">
              Everything you need to know about creating and managing <br />
              your Solana token on MemecoinOwner.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="hs-accordion-group space-y-4">
            {question.map((question, index) => (
              <div
                key={index}
                className={`hs-accordion bg-default-950/40   overflow-hidden rounded-lg border border-white/10 backdrop-blur-3xl`}
                id={question.id}
              >
                <button
                  className="hs-accordion-toggle inline-flex w-full items-center justify-between gap-x-3 px-6 py-4 text-left capitalize text-white transition-all"
                  aria-controls={`faq-accordion-${index + 1}`}
                >
                  <h5 className="flex text-base font-semibold">
                    <i
                      data-lucide="help-circle"
                      className="me-3 h-5 w-5 stroke-white align-middle"
                    ></i>
                    {question.question}
                  </h5>
                  <i
                    data-lucide="chevron-up"
                    className="hs-accordion-active:-rotate-180 h-4 w-4 transition-all duration-500"
                  ></i>
                </button>
                <div
                  id={`faq-accordion-${index + 1}`}
                  className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                  aria-labelledby={question.id}
                >
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-default-300 mb-2 text-sm font-medium">
                      {question.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
