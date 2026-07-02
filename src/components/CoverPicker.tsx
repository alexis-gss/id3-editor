import { useRef } from "react";
import type { ChangeEvent } from "react";
import { ImageIcon, ReplaceIcon, XIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";

interface CoverPickerProps {
  cover: CoverState | null;
  onCoverInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveCover: () => void;
}

/**
 * Renders the cover image picker, preview, and remove button.
 * @param {CoverPickerProps} props The component props.
 * @return {JSX.Element}
 */
export default function CoverPicker({
  cover,
  onCoverInput,
  onRemoveCover,
}: CoverPickerProps): JSX.Element {
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start">
      <label htmlFor="cover" className="mb-1 block text-xs text-ink/50">
        Cover
      </label>
      <button
        id="cover"
        type="button"
        onClick={() => coverInputRef.current?.click()}
        className="group relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-ink/15 bg-white/70 transition-colors duration-200 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
      >
        {cover ? (
          <>
            <img
              src={cover.dataUrl}
              alt="Cover of the album"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center gap-1 bg-[radial-gradient(circle,rgba(15,15,15,1)_0%,rgba(15,15,15,0.3)_100%)] text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
              <ReplaceIcon className="h-4 w-4" aria-hidden="true" />
              Change
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1 text-ink/50">
            <ImageIcon className="h-10 w-10" aria-hidden="true" />
            <span className="text-xs">Add cover</span>
          </span>
        )}
      </button>
      {cover && (
        <button
          type="button"
          onClick={onRemoveCover}
          className="mx-auto mt-1 flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-ink/0 px-2 py-1 text-xs text-ink/50 transition-colors duration-200 outline-none hover:bg-ink/5 hover:text-ink focus:border-accent focus:bg-ink/5 focus:text-ink focus:ring-2 focus:ring-accent-soft"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
          Remove cover
        </button>
      )}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={onCoverInput}
      />
    </div>
  );
}
