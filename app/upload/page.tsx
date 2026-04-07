"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Upload New Video</h1>
        <p className="mb-8 text-sm text-slate-600">
          Add title, description, video and thumbnail to publish.
        </p>
        <VideoUploadForm />
      </div>
    </div>
  );
}
