import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { XIcon, CheckIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";

interface CoverCropperProps {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (croppedAreaPixels: Area) => void;
}

/**
 * Renders the cover image cropper component.
 * @param {string} imageSrc The source of the image to be cropped.
 * @return {JSX.Element}
 */
export default function CoverCropper({
  imageSrc,
  onCancel,
  onConfirm,
}: CoverCropperProps): JSX.Element {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  /**
   * Handles the completion of the cropping process.
   * @param {Area} _croppedArea The cropped area.
   * @param {Area} pixels The pixels of the cropped area.
   */
  const handleCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5">
      <div className="flex h-full w-full max-w-[1000px] flex-col">
        <div className="relative flex-1">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex flex-col gap-3 bg-paper px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="zoom" className="text-xs text-ink/50">
              Zoom
            </label>
            <input
              id="zoom"
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="range-accent w-40"
              style={{
                background: `linear-gradient(to right, var(--color-accent, #6366f1) ${
                  ((zoom - 1) / (3 - 1)) * 100
                }%, rgba(15,15,15,0.15) ${((zoom - 1) / (3 - 1)) * 100}%)`,
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm text-ink/50 hover:bg-ink/5"
            >
              <XIcon className="h-4 w-4" aria-hidden="true" />
              Cancel
            </button>
            <button
              type="button"
              disabled={!croppedAreaPixels}
              onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-accent px-3 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4" aria-hidden="true" />
              Validate the crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
