import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { ID3Writer } from "browser-id3-writer";
import { parseBlob } from "music-metadata";
import type { Area } from "react-easy-crop";
import { bytesToArrayBuffer } from "@/utils/bytes";
import {
  loadImageFromFile,
  isSquare,
  canvasFromCrop,
  maxCoverFileSize,
  maxCoverDimension,
} from "@/utils/image";
import { sanitize } from "@/utils/string";
import { validateId3Form } from "@/schemas/id3.schema";

const emptyForm: FormState = {
  album: "",
  albumArtist: "",
  artist: "",
  bpm: "",
  comment: "",
  composer: "",
  copyright: "",
  discNumber: "",
  genre: "",
  lyrics: "",
  publisher: "",
  title: "",
  trackNumber: "",
  year: "",
};

const maxAudioFileSize = 100 * 1024 * 1024;

export function useId3Editor() {
  // States.
  const [file, setFile] = useState<File | null>(null);
  const [originalArrayBuffer, setOriginalArrayBuffer] =
    useState<ArrayBuffer | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [cover, setCover] = useState<CoverState | null>(null);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [pendingCoverSrc, setPendingCoverSrc] = useState<string | null>(null);
  const [pendingCoverMime, setPendingCoverMime] =
    useState<string>("image/jpeg");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showMoreFields, setShowMoreFields] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [undoSnapshot, setUndoSnapshot] = useState<{
    form: FormState;
    cover: CoverState | null;
  } | null>(null);

  // Refs.
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculs.
  const advancedFieldsCount = [
    form.trackNumber,
    form.discNumber,
    form.composer,
    form.publisher,
    form.bpm,
    form.copyright,
    form.lyrics,
  ].filter(Boolean).length;
  const hasFilledFields =
    Object.values(form).some((value) => value !== "") || cover !== null;

  /**
   * Resets the download URL and revokes the previous object URL if it exists.
   * @return {void}
   */
  const resetDownload = useCallback(() => {
    setDownloadUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  /**
   * Loads an MP3 file, reads its metadata, and updates the form and cover state.
   * @return {Promise<void>}
   */
  const loadFile = useCallback(
    async (selected: File) => {
      setError(null);
      resetDownload();

      const isMp3 =
        selected.type === "audio/mpeg" ||
        selected.name.toLowerCase().endsWith(".mp3");

      if (!isMp3) {
        setError("Select a valid MP3 file.");
        return;
      }

      if (selected.size > maxAudioFileSize) {
        setError("The file exceeds 100 MB, please choose a lighter one.");
        return;
      }

      setIsReading(true);
      setFile(selected);
      setForm(emptyForm);
      setCover(null);
      setShowMoreFields(false);
      setIsDirty(false);
      setUndoSnapshot(null);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

      try {
        const arrayBuffer = await selected.arrayBuffer();
        setOriginalArrayBuffer(arrayBuffer);

        const metadata = await parseBlob(selected).catch(() => null);
        if (metadata) {
          const { common } = metadata;
          setForm({
            title: common.title ?? "",
            artist: common.artist ?? common.artists?.[0] ?? "",
            albumArtist: common.albumartist ?? "",
            album: common.album ?? "",
            year: common.year ? String(common.year) : "",
            trackNumber:
              common.track?.no != null
                ? String(common.track.no) +
                  (common.track.of ? `/${common.track.of}` : "")
                : "",
            discNumber:
              common.disk?.no != null
                ? String(common.disk.no) +
                  (common.disk.of ? `/${common.disk.of}` : "")
                : "",
            genre: common.genre?.[0] ?? "",
            composer: common.composer?.[0] ?? "",
            publisher: common.label?.[0] ?? "",
            bpm: common.bpm != null ? String(common.bpm) : "",
            copyright: common.copyright ?? "",
            comment:
              common.comment?.[0]?.text ??
              common.comment?.[0]?.toString() ??
              "",
            lyrics: common.lyrics?.[0]?.text ?? "",
          });

          const picture = common.picture?.[0];
          if (picture) {
            const bytes =
              picture.data instanceof Uint8Array
                ? picture.data
                : new Uint8Array(picture.data as ArrayBufferLike);
            const blob = new Blob([bytesToArrayBuffer(bytes)], {
              type: picture.format || "image/jpeg",
            });
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(blob);
            });
            setCover({
              dataUrl,
              arrayBuffer: bytesToArrayBuffer(bytes),
              mimeType: picture.format || "image/jpeg",
            });
          }

          const hasExtraData =
            !!common.disk?.no ||
            !!common.label?.[0] ||
            common.bpm != null ||
            !!common.copyright ||
            !!common.lyrics?.[0]?.text;
          if (hasExtraData) setShowMoreFields(true);
        }
      } catch {
        setError(
          "The file could not be read. It may be corrupted or not a valid MP3 file.",
        );
      } finally {
        setIsReading(false);
      }
    },
    [resetDownload],
  );

  /**
   * Handles the file input change event, loading the selected MP3 file.
   * @param {ChangeEvent<HTMLInputElement>} event The change event from the file input.
   * @return {void}
   */
  const handleFileInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const selected = event.target.files?.[0];
    if (selected) void loadFile(selected);
  };

  /**
   * Handles the drop event for drag-and-drop file uploads, loading the dropped MP3 file.
   * @param {DragEvent<HTMLDivElement>} event The drag event from the drop area.
   * @return {void}
   */
  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) void loadFile(dropped);
  };

  /**
   * Handles the cover image input change event, validating and processing the selected image file.
   * @param {ChangeEvent<HTMLInputElement>} event The change event from the cover image input.
   * @return {Promise<void>}
   */
  const handleCoverInput = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    setError(null);

    if (selected.size > maxCoverFileSize) {
      setError("The image exceeds 5 MB, please choose a lighter one.");
      return;
    }

    let mimeType = selected.type;
    if (mimeType === "image/jpg") mimeType = "image/jpeg";
    if (!mimeType) {
      mimeType = selected.name.toLowerCase().endsWith(".png")
        ? "image/png"
        : "image/jpeg";
    }
    if (mimeType !== "image/jpeg" && mimeType !== "image/png") {
      setError("Only JPEG and PNG formats are accepted.");
      return;
    }

    try {
      const img = await loadImageFromFile(selected);
      const dims = { width: img.naturalWidth, height: img.naturalHeight };

      if (isSquare(dims) && dims.width <= maxCoverDimension) {
        const { arrayBuffer, dataUrl } = await canvasFromCrop(
          img,
          { x: 0, y: 0, width: dims.width, height: dims.height },
          mimeType,
        );
        setCover({ dataUrl, arrayBuffer, mimeType });
        if (downloadUrl) setIsDirty(true);
      } else {
        setPendingCoverMime(mimeType);
        setPendingCoverSrc(URL.createObjectURL(selected));
      }
    } catch {
      setError("Cannot read this image.");
    }
  };

  /**
   * Removes the current cover image.
   * @return {void}
   */
  const removeCover = (): void => {
    setCover(null);
    if (downloadUrl) setIsDirty(true);
  };

  /**
   * Updates a specific field in the form state based on user input.
   * @param {keyof FormState} field The field to update.
   * @return {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
   */
  const updateField =
    (
      field: keyof FormState,
    ): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setError(null);
      if (downloadUrl) setIsDirty(true);
    };

  /**
   * Clears a specific field in the form state.
   * @param {keyof FormState} field The field to clear.
   * @return {() => void}
   */
  const clearField =
    (field: keyof FormState): (() => void) =>
    () => {
      setForm((prev) => ({ ...prev, [field]: "" }));
      setError(null);
      if (downloadUrl) setIsDirty(true);
    };

  /**
   * Triggers a browser download for the given blob URL.
   * @param {string} url The object URL to download.
   * @param {string} name The filename to use for the download.
   * @return {void}
   */
  const triggerDownload = (url: string, name: string): void => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Generates a new MP3 file with the updated metadata and cover image, validating the form fields before proceeding.
   * @return {Promise<void>}
   */
  const handleGenerate = async (): Promise<void> => {
    if (!file || !originalArrayBuffer) return;

    const { valid, errors } = validateId3Form(form);
    setFieldErrors(errors);
    if (!valid) {
      setError("Please correct the fields in red before generating the file.");
      return;
    }

    setError(null);
    resetDownload();

    try {
      const bufferCopy = originalArrayBuffer.slice(0);
      const writer = new ID3Writer(bufferCopy);

      if (form.title) writer.setFrame("TIT2", form.title);
      if (form.artist) writer.setFrame("TPE1", [form.artist]);
      if (form.albumArtist) writer.setFrame("TPE2", form.albumArtist);
      if (form.album) writer.setFrame("TALB", form.album);
      if (form.year && !Number.isNaN(Number(form.year))) {
        writer.setFrame("TYER", Number(form.year));
      }
      if (form.trackNumber) writer.setFrame("TRCK", form.trackNumber);
      if (form.discNumber) writer.setFrame("TPOS", form.discNumber);
      if (form.genre) writer.setFrame("TCON", [form.genre]);
      if (form.composer) writer.setFrame("TCOM", [form.composer]);
      if (form.publisher) writer.setFrame("TPUB", form.publisher);
      if (form.bpm && !Number.isNaN(Number(form.bpm))) {
        writer.setFrame("TBPM", Number(form.bpm));
      }
      if (form.copyright) writer.setFrame("TCOP", form.copyright);
      if (form.comment) {
        writer.setFrame("COMM", {
          description: "",
          text: form.comment,
          language: "fra",
        });
      }
      if (form.lyrics) {
        writer.setFrame("USLT", {
          description: "",
          lyrics: form.lyrics,
          language: "fra",
        });
      }
      if (cover) {
        writer.setFrame("APIC", {
          type: 3,
          data: cover.arrayBuffer,
          description: "Cover",
        });
      }

      writer.addTag();
      const blob = writer.getBlob();
      const url = URL.createObjectURL(blob);

      const fallbackName = file.name.replace(/\.mp3$/i, "");
      const baseName =
        form.artist && form.title
          ? `${form.title} - ${form.artist}`
          : form.title || `${fallbackName} - updated.mp3`;
      const finalName = sanitize(baseName);

      setDownloadUrl(url);
      setIsDirty(false);

      triggerDownload(url, finalName);
    } catch (err) {
      setError(
        `File generation failed: ${err instanceof Error ? err.message : "unknown error"}.`,
      );
    }
  };

  /**
   * Resets the form and state to their initial values, clearing the selected file, cover image, and any errors or download links.
   * @return {void}
   */
  const handleReset = (): void => {
    setFile(null);
    setOriginalArrayBuffer(null);
    setForm(emptyForm);
    setCover(null);
    setError(null);
    resetDownload();
    setShowMoreFields(false);
    setIsDirty(false);
    setUndoSnapshot(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  /**
   * Confirms the crop operation and updates the cover image with the cropped version.
   * @param {Area} cropPixels The area to crop from the cover image.
   * @return {Promise<void>}
   */
  const handleCropConfirm = async (cropPixels: Area): Promise<void> => {
    if (!pendingCoverSrc) return;
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = pendingCoverSrc;
      });
      const { arrayBuffer, dataUrl, mimeType } = await canvasFromCrop(
        img,
        cropPixels,
        pendingCoverMime,
      );
      setCover({ dataUrl, arrayBuffer, mimeType });
      if (downloadUrl) setIsDirty(true);
    } catch {
      setError("Cover cropping failed.");
    } finally {
      URL.revokeObjectURL(pendingCoverSrc);
      setPendingCoverSrc(null);
    }
  };

  /**
   * Cancels the crop operation and revokes the pending cover image URL.
   * @return {void}
   */
  const handleCropCancel = (): void => {
    if (pendingCoverSrc) URL.revokeObjectURL(pendingCoverSrc);
    setPendingCoverSrc(null);
  };

  /**
   * Clears all form fields, keeping the loaded file and cover intact, and offers a temporary undo.
   * @return {void}
   */
  const handleClearAll = (): void => {
    setUndoSnapshot({ form, cover });
    setForm(emptyForm);
    setCover(null);
    setFieldErrors({});
    setError(null);
    if (downloadUrl) setIsDirty(true);

    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setUndoSnapshot(null);
    }, 6000);
  };

  /**
   * Restores the form and cover state from the last undo snapshot.
   * @return {void}
   */
  const handleUndoClear = (): void => {
    if (!undoSnapshot) return;
    setForm(undoSnapshot.form);
    setCover(undoSnapshot.cover);
    setUndoSnapshot(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    if (downloadUrl) setIsDirty(true);
  };

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  return {
    // State
    file,
    form,
    cover,
    isReading,
    error,
    downloadUrl,
    pendingCoverSrc,
    fieldErrors,
    showMoreFields,
    isDirty,
    undoSnapshot,
    advancedFieldsCount,
    hasFilledFields,
    // Setters
    setShowMoreFields,
    // Handlers
    handleFileInput,
    handleDrop,
    handleCoverInput,
    removeCover,
    updateField,
    clearField,
    handleGenerate,
    handleReset,
    handleCropConfirm,
    handleCropCancel,
    handleClearAll,
    handleUndoClear,
  };
}
