"use client";

import type { ChangeEvent, DragEvent, ReactElement } from "react";
import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { insforge } from "@/lib/insforge-client";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

type ResumeUploadProps = {
  userId: string;
  resumePdfUrl: string | null;
  resumePdfKey: string | null;
  onUploaded: (url: string, key: string) => void;
};

export function ResumeUpload({
  userId,
  resumePdfUrl,
  resumePdfKey,
  onUploaded,
}: ResumeUploadProps): ReactElement {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null): Promise<void> => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }

    if (file.size > MAX_RESUME_BYTES) {
      setError("Resume files must be 5MB or smaller.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const key = `${userId}/resume.pdf`;
    const { data, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(key, file);

    setIsUploading(false);

    if (uploadError || !data?.url || !data.key) {
      console.error("[components/profile/ResumeUpload]", uploadError);
      setError("Could not upload your resume. Please try again.");
      return;
    }

    setFileName(file.name);
    onUploaded(data.url, data.key);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault();
    await handleFiles(event.dataTransfer.files);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div>
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Resume
        </h2>
        <p className="mt-1 text-xs font-normal leading-4 text-text-muted">
          Upload an existing resume to use in this profile, or generate a new
          version from your profile details below.
        </p>
      </div>

      <div
        className="mt-5 flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-border bg-surface-secondary px-6 py-8 text-center"
        onDragOver={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
        }}
        onDrop={handleDrop}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-accent-muted text-accent">
          <UploadCloud className="size-5" aria-hidden />
        </span>
        <p className="mt-4 text-sm font-semibold leading-5 text-text-primary">
          Click to upload or drag and drop
        </p>
        <p className="mt-1 text-xs font-normal leading-4 text-text-muted">
          PDF documents only. Maximum file size 5MB.
        </p>
        {fileName || resumePdfKey ? (
          <p className="mt-2 text-xs font-medium leading-4 text-text-secondary">
            {fileName ?? "resume.pdf"}
            {resumePdfUrl ? " uploaded" : ""}
          </p>
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={isUploading}
          className="mt-4 inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium leading-5 text-text-primary hover:bg-surface-secondary disabled:opacity-70"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          {isUploading ? "Uploading..." : "Select Resume"}
        </button>
        {error ? (
          <p className="mt-3 text-xs font-medium leading-4 text-error">{error}</p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-normal leading-4 text-text-muted">
          Need a fresh document based on this profile?
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium leading-5 text-accent-foreground hover:bg-accent-dark"
        >
          <FileText className="size-4" aria-hidden />
          Generate Resume from Profile
        </button>
      </div>
    </section>
  );
}
