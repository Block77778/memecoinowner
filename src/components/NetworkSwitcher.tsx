import { FC } from "react";
import dynamic from "next/dynamic";

// Network is locked to mainnet — no switcher shown to users
const NetworkSwitcher: FC = () => {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
      Mainnet
    </span>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false,
});
