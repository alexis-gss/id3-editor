import type { ChangeEvent } from "react";
import type { JSX } from "astro/jsx-runtime";
import { FieldString, FieldTextarea } from "@/components/Fields";

interface BasicFieldsProps {
  form: FormState;
  fieldErrors: Record<string, string>;
  updateField: (
    field: keyof FormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  clearField: (field: keyof FormState) => () => void;
}

/**
 * Renders the primary metadata fields (title, artist, album, etc.).
 * @param {BasicFieldsProps} props The component props.
 * @return {JSX.Element}
 */
export default function BasicFields({
  form,
  fieldErrors,
  updateField,
  clearField,
}: BasicFieldsProps): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FieldString
        label="Title"
        value={form.title}
        onChange={updateField("title")}
        onClear={clearField("title")}
        fieldErrors={fieldErrors}
        fieldKey="title"
        placeholder="Bohemian Rhapsody"
      />
      <FieldString
        label="Artist"
        value={form.artist}
        onChange={updateField("artist")}
        onClear={clearField("artist")}
        fieldErrors={fieldErrors}
        fieldKey="artist"
        placeholder="Queen"
      />
      <FieldString
        label="Album"
        value={form.album}
        onChange={updateField("album")}
        onClear={clearField("album")}
        fieldErrors={fieldErrors}
        fieldKey="album"
        placeholder="A Night at the Opera"
      />
      <FieldString
        label="Album Artist"
        value={form.albumArtist}
        onChange={updateField("albumArtist")}
        onClear={clearField("albumArtist")}
        fieldErrors={fieldErrors}
        fieldKey="albumArtist"
        placeholder="Queen"
      />
      <FieldString
        label="Year"
        value={form.year}
        onChange={updateField("year")}
        onClear={clearField("year")}
        fieldErrors={fieldErrors}
        inputMode="numeric"
        fieldKey="year"
        placeholder="1975"
      />
      <FieldString
        label="Genre"
        value={form.genre}
        onChange={updateField("genre")}
        onClear={clearField("genre")}
        fieldErrors={fieldErrors}
        fieldKey="genre"
        placeholder="Rock"
      />
      <FieldTextarea
        label="Comment"
        value={form.comment}
        onChange={updateField("comment")}
        onClear={clearField("comment")}
        fieldErrors={fieldErrors}
        fieldKey="comment"
        placeholder="Add a note about this track…"
      />
    </div>
  );
}
