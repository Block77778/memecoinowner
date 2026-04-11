import { FC, ChangeEvent } from "react";

type InputViewProps = {
  name?: string;
  placeholder?: string;
  clickhandle?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const InputView: FC<InputViewProps> = ({
  name,
  placeholder,
  clickhandle,
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      {name && (
        <label className="block text-white/80 mb-1 text-sm">
          {name}
        </label>
      )}

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        onChange={clickhandle}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 placeholder-white/30 outline-none transition-all duration-300 focus:border-primary/50 focus:bg-white/10"
      />
    </div>
  );
};
