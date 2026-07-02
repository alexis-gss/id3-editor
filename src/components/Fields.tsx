import { XIcon } from "lucide-react";
import type { ChangeEvent, MouseEvent } from "react";
import type { JSX } from "astro/jsx-runtime";

interface FieldStringProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: (event: MouseEvent<HTMLButtonElement>) => void;
  inputMode?: "numeric" | "text";
  fieldErrors: Record<string, string>;
  fieldKey: string;
  placeholder: string;
  disabled?: boolean;
}

/**
 * Renders a form field with a label and error message.
 * @param {FieldStringProps} object The props for the field component.
 * @return {JSX.Element}
 */
export function FieldString({
  label,
  value,
  onChange,
  onClear,
  inputMode,
  fieldErrors,
  fieldKey,
  placeholder,
  disabled,
}: FieldStringProps): JSX.Element {
  const errorKey = fieldKey ?? label;
  return (
    <div>
      <label htmlFor={errorKey} className="mb-1 block text-xs text-ink/50">
        {label}
      </label>
      <div className="relative">
        <input
          id={errorKey}
          type="text"
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg border border-ink/15 bg-white py-2 ps-3 pe-7 text-sm text-ink transition-colors duration-200 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded border border-ink/0 p-0.5 text-ink/50 transition-colors duration-200 outline-none hover:bg-ink/5 hover:text-ink focus:border-accent focus:bg-ink/5 focus:ring-2 focus:ring-accent-soft"
            aria-label={`Clear ${label}`}
            disabled={disabled}
          >
            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {fieldErrors[errorKey] && (
        <p className="mt-1 text-xs text-red-700">{fieldErrors[errorKey]}</p>
      )}
    </div>
  );
}

interface FieldTextareaProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClear: (event: MouseEvent<HTMLButtonElement>) => void;
  fieldErrors: Record<string, string>;
  fieldKey: string;
  placeholder: string;
  disabled?: boolean;
}

export function FieldTextarea({
  label,
  value,
  onChange,
  onClear,
  fieldErrors,
  fieldKey,
  placeholder,
  disabled,
}: FieldTextareaProps): JSX.Element {
  const errorKey = fieldKey ?? label;
  return (
    <div className="sm:col-span-2">
      <label htmlFor={errorKey} className="mb-1 block text-xs text-ink/50">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={errorKey}
          value={value}
          rows={2}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink transition-colors duration-200 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute top-[1.2rem] right-2 -translate-y-1/2 cursor-pointer rounded border border-ink/0 p-0.5 text-ink/50 transition-colors duration-200 outline-none hover:bg-ink/5 hover:text-ink focus:border-accent focus:bg-ink/5 focus:ring-2 focus:ring-accent-soft"
            aria-label={`Clear ${label}`}
            disabled={disabled}
          >
            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {fieldErrors[errorKey] && (
        <p className="mt-1 text-xs text-red-700">{fieldErrors[errorKey]}</p>
      )}
    </div>
  );
}
