interface FormState {
  album: string;
  albumArtist: string;
  artist: string;
  bpm: string;
  comment: string;
  composer: string;
  copyright: string;
  discNumber: string;
  genre: string;
  lyrics: string;
  publisher: string;
  title: string;
  trackNumber: string;
  year: string;
}

interface CoverState {
  dataUrl: string;
  arrayBuffer: ArrayBuffer;
  mimeType: string;
}
