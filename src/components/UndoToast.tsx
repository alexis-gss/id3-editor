import { UndoIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";

interface UndoToastProps {
  onUndo: () => void;
}

/**
 * Renders a dismissible toast with an undo action and a visual expiration timer.
 * @param {UndoToastProps} props The component props.
 * @return {JSX.Element}
 */
export default function UndoToast({ onUndo }: UndoToastProps): JSX.Element {
  return (
    <div className="border-yellow/15 relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
      <span className="z-10">Fields cleared</span>
      <button
        type="button"
        onClick={onUndo}
        className="focus:border-yellow z-1 flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-ink/0 px-2 py-1 text-xs transition-colors duration-200 outline-none hover:bg-yellow-500/50 focus:bg-yellow-500/50 focus:ring-2 focus:ring-yellow-500/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <UndoIcon className="h-4 w-4" aria-hidden="true" />
        Undo
      </button>
      <div className="progress-bar absolute inset-x-0 bottom-0 h-full origin-left bg-yellow-500/50" />
    </div>
  );
}
