import type { ChangeEvent } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";
import { FieldString, FieldTextarea } from "@/components/Fields";

interface AdvancedFieldsToggleProps {
  form: FormState;
  fieldErrors: Record<string, string>;
  showMoreFields: boolean;
  advancedFieldsCount: number;
  onToggle: () => void;
  updateField: (
    field: keyof FormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  clearField: (field: keyof FormState) => () => void;
}

/**
 * Renders the collapsible section with advanced metadata fields.
 * @param {AdvancedFieldsToggleProps} props The component props.
 * @return {JSX.Element}
 */
export default function AdvancedFieldsToggle({
  form,
  fieldErrors,
  showMoreFields,
  advancedFieldsCount,
  onToggle,
  updateField,
  clearField,
}: AdvancedFieldsToggleProps): JSX.Element {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="mt-4 flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-ink/0 px-2 py-1 text-xs text-ink/50 transition-colors duration-200 outline-none hover:bg-ink/5 hover:text-ink focus:border-accent focus:bg-ink/5 focus:text-ink focus:ring-2 focus:ring-accent-soft"
        aria-expanded={showMoreFields}
      >
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            showMoreFields ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
        {showMoreFields
          ? "Hide advanced fields"
          : "Show advanced fields (disc number, publisher, BPM, copyright, lyrics)"}
        {advancedFieldsCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xs text-white">
            {advancedFieldsCount}
          </span>
        )}
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: showMoreFields ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className={`grid gap-4 border-t border-ink/15 pt-4 transition-opacity duration-200 ease-in-out sm:grid-cols-2 ${
              showMoreFields
                ? "mt-4 opacity-100 delay-150"
                : "mt-0 opacity-0 delay-0"
            }`}
          >
            <FieldString
              label="Track number"
              value={form.trackNumber}
              onChange={updateField("trackNumber")}
              onClear={clearField("trackNumber")}
              fieldErrors={fieldErrors}
              fieldKey="trackNumber"
              disabled={!showMoreFields}
              placeholder="11/12"
            />
            <FieldString
              label="Disc number"
              value={form.discNumber}
              onChange={updateField("discNumber")}
              onClear={clearField("discNumber")}
              fieldErrors={fieldErrors}
              fieldKey="discNumber"
              disabled={!showMoreFields}
              placeholder="1/2"
            />
            <FieldString
              label="Composer"
              value={form.composer}
              onChange={updateField("composer")}
              onClear={clearField("composer")}
              fieldErrors={fieldErrors}
              fieldKey="composer"
              disabled={!showMoreFields}
              placeholder="Freddie Mercury"
            />
            <FieldString
              label="Publisher"
              value={form.publisher}
              onChange={updateField("publisher")}
              onClear={clearField("publisher")}
              fieldErrors={fieldErrors}
              fieldKey="publisher"
              disabled={!showMoreFields}
              placeholder="EMI Records"
            />
            <FieldString
              label="BPM"
              value={form.bpm}
              onChange={updateField("bpm")}
              onClear={clearField("bpm")}
              fieldErrors={fieldErrors}
              fieldKey="bpm"
              inputMode="numeric"
              disabled={!showMoreFields}
              placeholder="72"
            />
            <FieldString
              label="Copyright"
              value={form.copyright}
              onChange={updateField("copyright")}
              onClear={clearField("copyright")}
              fieldErrors={fieldErrors}
              fieldKey="copyright"
              disabled={!showMoreFields}
              placeholder="© 1975 EMI Records"
            />
            <FieldTextarea
              label="Lyrics"
              value={form.lyrics}
              onChange={updateField("lyrics")}
              onClear={clearField("lyrics")}
              fieldErrors={fieldErrors}
              fieldKey="lyrics"
              disabled={!showMoreFields}
              placeholder="Is this the real life? Is this just fantasy?…"
            />
          </div>
        </div>
      </div>
    </>
  );
}
