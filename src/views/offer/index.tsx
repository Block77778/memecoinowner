import { FC } from "react";

export const OfferView: FC = () => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-medium capitalize text-white">
              Why Choose Us?
            </h2>
            <p className="text-default-200 text-sm font-medium">
              Instant coin creation, safe and anyone can use it — no experience with coding or
              crypto needed. Make a coin and manage it free through our site.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="bg-default-950/40 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="file-text" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Instant Token Launch
                </h3>
                <p className="text-default-100 text-sm font-medium">
                  Can be on the Solana blockchain in 60 seconds. No development experience required — just fill out a quick form and you own your own crypto.
                </p>
              </div>
            </div>
            <div className="bg-default-950/40 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="pen" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Edit Your Coin On The Blockchain
                </h3>
                <p className="text-default-100 text-sm font-medium">
                  Update your token at anytime, easily and free.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-default-950/40 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="database" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Real-Time Transaction Tracking
                </h3>
                <p className="text-default-100 text-sm font-medium">
                  Make it and instantly see it on Solana. Crypto coin buyers will also instantly be able to see and buy it.
                </p>
              </div>
            </div>
            <div className="bg-default-950/40 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="palette" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Zero Code Required
                </h3>
                <p className="text-default-100 text-sm font-medium">
                  No hiring or learning coding, no waiting and no complex steps.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-default-950/40 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="case-sensitive" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Multi-Wallet Support
                </h3>
                <p className="text-default-100 text-sm font-medium">
                  Connect with Phantom, Solflare, Backpack, and all major Solana wallets.
                </p>
              </div>
            </div>
            <div className="bg-default-950/40 border-primary border-s-2 rounded-xl backdrop-blur-3xl transition-all duration-500">
              <div className="p-10">
                <i data-lucide="shield" className="text-primary h-10 w-10"></i>
                <h3 className="mb-4 mt-8 text-2xl font-medium text-white">
                  Secure &amp; Safe
                </h3>
                <p className="text-default-100 text-sm font-medium">
                  Your wallet, your access only. MemeCoinOwner never holds your funds — every transaction is signed directly from your wallet. Your coin is only accessible and owned by you. We have no access or authorization to your coin or data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
