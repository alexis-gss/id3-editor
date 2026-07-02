import type { DragEvent } from "react";
import { useRef, useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";

interface DropZoneProps {
  onFileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

/**
 * Renders the drag-and-drop / click-to-select area for choosing an MP3 file.
 * @param {DropZoneProps} props The component props.
 * @return {JSX.Element}
 */
export default function DropZone({
  onFileSelected,
  onDrop,
}: DropZoneProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        setIsDragging(false);
        onDrop(e);
      }}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors duration-200 ${
        isDragging
          ? "border-accent bg-accent-soft"
          : "border-ink/15 bg-white outline-none hover:border-accent focus:border-accent"
      }`}
    >
      <UploadCloudIcon className="h-10 w-10 text-accent" aria-hidden="true" />
      <p className="text-ink">
        Drag and drop an file here, or click to select one
      </p>
      <p className="text-sm text-ink/50">
        Must be an MP3 file. Max size: 100 MB.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,.mp3"
        className="hidden"
        onChange={onFileSelected}
      />
    </div>
  );
}
