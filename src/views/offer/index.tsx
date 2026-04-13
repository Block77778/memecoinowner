import { FC } from "react";

export const OfferView: FC = () => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Why Creators Choose MemecoinOwner
            </h2>
            <p className="text-default-200 text-sm font-medium">
              Built for speed, security, and simplicity — everything you need to
              go from idea to launched token in minutes.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="bg-default-950/40 hover:-trandefault-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="file-text" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Instant Token Launch
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  Deploy your Solana token to mainnet or devnet in under 60 seconds.
                  No development experience required — just fill in your token details and go.
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                  Learn More <i data-lucide="move-right" className="h-4 w-4"></i>
                </a>
              </div>
            </div>
            <div className="bg-default-950/40 hover:-trandefault-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="pen" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Editable On-Chain Metadata
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  Update your token's name, symbol, image, and URI at any time.
                  Keep your project's identity current as your community grows.
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                  Learn More <i data-lucide="move-right" className="h-4 w-4"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-default-950/40 hover:-trandefault-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="database" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Real-Time Transaction Tracking
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  Monitor every transaction as it happens. Full on-chain visibility
                  with direct links to Solana Explorer for every action you take.
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                  Learn More <i data-lucide="move-right" className="h-4 w-4"></i>
                </a>
              </div>
            </div>
            <div className="bg-default-950/40 hover:-trandefault-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="gitlab" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Airdrop & Distribution Tools
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  Distribute tokens to your community effortlessly. Use our airdrop
                  tools to send tokens to multiple wallets in a single operation.
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                  Learn More <i data-lucide="move-right" className="h-4 w-4"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-default-950/40 hover:-trandefault-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="palette" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Zero Code Required
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  No Rust, no Solana CLI, no complexity. MemecoinOwner handles
                  all the blockchain interaction so you can focus on building your brand.
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                  Learn More <i data-lucide="move-right" className="h-4 w-4"></i>
                </a>
              </div>
            </div>
            <div className="bg-default-950/40 hover:-trandefault-y-2 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i
                  data-lucide="case-sensitive"
                  className="text-primary h-10 w-10"
                ></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Multi-Wallet Support
                </h3>
                <p className="text-default-100 mb-4 text-sm font-medium">
                  Connect with Phantom, Solflare, Backpack, and all major Solana
                  wallets. Seamlessly switch between wallets and networks.
                </p>
                <a
                  href="#"
                  className="text-primary group relative inline-flex items-center gap-2"
                >
                  <span className="bg-primary/80 absolute -bottom-0 h-px w-7/12 rounded transition-all duration-500 group-hover:w-full"></span>
                  Learn More <i data-lucide="move-right" className="h-4 w-4"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
