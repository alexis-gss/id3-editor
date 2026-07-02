import { DownloadIcon, XIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";

interface GenerateActionsProps {
  downloadUrl: string | null;
  isDirty: boolean;
  hasFilledFields: boolean;
  onGenerate: () => void;
  onClearAll: () => void;
}

/**
 * Renders the generate/download and clear-all action buttons.
 * @param {GenerateActionsProps} props The component props.
 * @return {JSX.Element}
 */
export default function GenerateActions({
  downloadUrl,
  isDirty,
  hasFilledFields,
  onGenerate,
  onClearAll,
}: GenerateActionsProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onGenerate}
        className="flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-accent px-4 py-2.5 text-sm text-white transition-colors duration-200 outline-none hover:bg-accent/90 focus:border-accent focus:bg-accent/90 focus:ring-2 focus:ring-accent-soft"
      >
        <DownloadIcon className="h-4 w-4" aria-hidden="true" />
        {downloadUrl && !isDirty ? "Re-download" : "Generate and download"}
      </button>
      <button
        type="button"
        onClick={onClearAll}
        disabled={!hasFilledFields}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-ink/0 px-2 py-1 text-xs text-ink/50 transition-colors duration-200 outline-none hover:bg-ink/5 hover:text-ink focus:border-accent focus:bg-ink/5 focus:text-ink focus:ring-2 focus:ring-accent-soft disabled:pointer-events-none disabled:opacity-40"
      >
        <XIcon className="h-4 w-4" aria-hidden="true" />
        Clear all fields
      </button>
    </div>
  );
}
