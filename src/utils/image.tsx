export const maxCoverFileSize = 5 * 1024 * 1024;
export const maxCoverDimension = 1000;

interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Loads an image from a file.
 * @param {File} file The file to load.
 * @return {Promise<HTMLImageElement>}
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/**
 * Check if the image dimensions are square.
 * @param {ImageDimensions} dim Dimensions of the image.
 * @return {boolean}
 */
export function isSquare(dim: ImageDimensions): boolean {
  return dim.width === dim.height;
}

/**
 * Draw a crop zone of image source in a square canvas.
 * @param {HTMLImageElement} image Image source.
 * @param {Object} cropPixels Crop coordinates.
 * @param {string} mimeType Mime type of the output image.
 * @return {Promise<{ arrayBuffer: ArrayBuffer; dataUrl: string; mimeType: string }>}
 */
export async function canvasFromCrop(
  image: HTMLImageElement,
  cropPixels: { x: number; y: number; width: number; height: number },
  mimeType: string,
): Promise<{ arrayBuffer: ArrayBuffer; dataUrl: string; mimeType: string }> {
  const outputSize = Math.min(cropPixels.width, maxCoverDimension);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot create canvas context.");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  const outputMime = mimeType === "image/png" ? "image/png" : "image/jpeg";
  const quality = outputMime === "image/jpeg" ? 0.9 : undefined;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputMime, quality),
  );
  if (!blob) throw new Error("Failed to export the cropped image.");

  const arrayBuffer = await blob.arrayBuffer();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

  return { arrayBuffer, dataUrl, mimeType: outputMime };
}
