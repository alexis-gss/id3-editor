import { Loader2Icon, MusicIcon } from "lucide-react";
import type { JSX } from "astro/jsx-runtime";
import CoverCropper from "@/components/CoverCropper";
import { useId3Editor } from "@/hooks/use-id3-editor";
import DropZone from "@/components/DropZone";
import FileHeader from "@/components/FileHeader";
import CoverPicker from "@/components/CoverPicker";
import BasicFields from "@/components/BasicFields";
import AdvancedFieldsToggle from "@/components/AdvancedFieldsToggle";
import UndoToast from "@/components/UndoToast";
import GenerateActions from "@/components/GenerateActions";

/**
 * Renders the ID3 metadata editor page.
 * @return {JSX.Element}
 */
export default function Id3Editor(): JSX.Element {
  const editor = useId3Editor();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-accent">
          <MusicIcon className="h-6 w-6" aria-hidden="true" />
          <span className="text-sm tracking-wide uppercase">MP3 Editor</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          Edit your MP3 metadata
        </h1>
        <p className="text-sm text-ink/50">
          All processing happens in your browser: the file is never sent to a
          server.
        </p>
      </header>
      {!editor.file ? (
        <DropZone
          onFileSelected={editor.handleFileInput}
          onDrop={editor.handleDrop}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <FileHeader file={editor.file} onReset={editor.handleReset} />
          {editor.isReading ? (
            <div className="flex items-center gap-2 text-xs text-ink/50">
              <Loader2Icon
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Reading existing metadata…
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[160px_1fr]">
              <CoverPicker
                cover={editor.cover}
                onCoverInput={editor.handleCoverInput}
                onRemoveCover={editor.removeCover}
              />
              <div className="flex flex-col">
                <BasicFields
                  form={editor.form}
                  fieldErrors={editor.fieldErrors}
                  updateField={editor.updateField}
                  clearField={editor.clearField}
                />
                <AdvancedFieldsToggle
                  form={editor.form}
                  fieldErrors={editor.fieldErrors}
                  showMoreFields={editor.showMoreFields}
                  advancedFieldsCount={editor.advancedFieldsCount}
                  onToggle={() => editor.setShowMoreFields((prev) => !prev)}
                  updateField={editor.updateField}
                  clearField={editor.clearField}
                />
              </div>
            </div>
          )}
          {editor.pendingCoverSrc && (
            <CoverCropper
              imageSrc={editor.pendingCoverSrc}
              onCancel={editor.handleCropCancel}
              onConfirm={editor.handleCropConfirm}
            />
          )}
          {editor.undoSnapshot && <UndoToast onUndo={editor.handleUndoClear} />}
          {editor.error && (
            <p className="border-red/15 rounded-lg border bg-red-50 px-3 py-2 text-center text-sm text-red-700">
              {editor.error}
            </p>
          )}
          {!editor.isReading && (
            <GenerateActions
              downloadUrl={editor.downloadUrl}
              isDirty={editor.isDirty}
              hasFilledFields={editor.hasFilledFields}
              onGenerate={editor.handleGenerate}
              onClearAll={editor.handleClearAll}
            />
          )}
        </div>
      )}
    </div>
  );
}
