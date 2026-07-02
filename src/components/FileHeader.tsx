import { FileAudioIcon, XIcon } from "lucide-react";
import { formatBytes } from "@/utils/bytes";
import type { JSX } from "astro/jsx-runtime";

interface FileHeaderProps {
  file: File;
  onReset: () => void;
}

/**
 * Renders the loaded file summary bar with a button to change the file.
 * @param {FileHeaderProps} props The component props.
 * @return {JSX.Element}
 */
export default function FileHeader({
  file,
  onReset,
}: FileHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-ink/15 bg-white/70 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <FileAudioIcon
          className="h-6 w-6 shrink-0 text-accent"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">{file.name}</p>
          <p className="text-xs text-ink/50">{formatBytes(file.size)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-ink/0 px-2 py-1 text-xs text-ink/50 transition-colors duration-200 outline-none hover:bg-ink/5 hover:text-ink focus:border-accent focus:bg-ink/5 focus:text-ink focus:ring-2 focus:ring-accent-soft"
      >
        <XIcon className="h-4 w-4" aria-hidden="true" />
        Change file
      </button>
    </div>
  );
}
