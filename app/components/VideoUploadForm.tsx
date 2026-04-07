"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { UploadResponse } from "@imagekit/next";
import FileUpload from "./fileUpload";

type FormState = {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
};

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  videoUrl: "",
  thumbnailUrl: "",
};

function getUploadedUrl(file: UploadResponse): string {
  return file.url ?? "";
}

export default function VideoUploadForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);

  const canSubmit = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      form.description.trim().length > 0 &&
      form.videoUrl.length > 0 &&
      form.thumbnailUrl.length > 0 &&
      !saving
    );
  }, [form, saving]);

  const onVideoSuccess = (upload: UploadResponse) => {
    const url = getUploadedUrl(upload);
    if (!url) {
      setError("Video upload succeeded but returned no URL");
      return;
    }

    setError(null);
    setForm((current) => ({ ...current, videoUrl: url }));
  };

  const onThumbnailSuccess = (upload: UploadResponse) => {
    const url = getUploadedUrl(upload);
    if (!url) {
      setError("Thumbnail upload succeeded but returned no URL");
      return;
    }

    setError(null);
    setForm((current) => ({ ...current, thumbnailUrl: url }));
  };

  const submitVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          videoUrl: form.videoUrl,
          thumbnailUrl: form.thumbnailUrl,
          controls: true,
          transformation: {
            width: 1080,
            height: 1920,
            quality: 90,
          },
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Failed to create video");
      }

      setForm(INITIAL_FORM);
      setVideoProgress(0);
      setThumbnailProgress(0);
      router.push("/");
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Upload failed";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submitVideo} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="My best short video"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Describe your video"
          required
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Upload Video</p>
        <FileUpload
          fileType="video"
          onSuccess={onVideoSuccess}
          onProgress={setVideoProgress}
        />
        {form.videoUrl && (
          <p className="text-xs text-green-700">Video uploaded successfully</p>
        )}
        {!form.videoUrl && videoProgress > 0 && (
          <p className="text-xs text-zinc-600">Uploading: {videoProgress}%</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Upload Thumbnail</p>
        <FileUpload
          fileType="image"
          onSuccess={onThumbnailSuccess}
          onProgress={setThumbnailProgress}
        />
        {form.thumbnailUrl && (
          <p className="text-xs text-green-700">
            Thumbnail uploaded successfully
          </p>
        )}
        {!form.thumbnailUrl && thumbnailProgress > 0 && (
          <p className="text-xs text-zinc-600">
            Uploading: {thumbnailProgress}%
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Publish Video"}
      </button>
    </form>
  );
}
