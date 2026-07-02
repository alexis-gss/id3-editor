/**
 * Builds an ArrayBuffer from a Uint8Array.
 * @param {Uint8Array} bytes The bytes to convert.
 * @return {ArrayBuffer}
 */
export function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

/**
 * Formats a number of bytes into a human-readable string.
 * @param {number} bytes The number of bytes to format.
 * @return {string}
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  const units = ["Ko", "Mo", "Go"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
