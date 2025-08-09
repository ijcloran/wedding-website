"use client";
import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "#convex/_generated/api";
import { Id } from "#convex/_generated/dataModel";

export default function AdminUploadPage() {
  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const createPhoto = useMutation(api.photos.create);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl({});
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const { storageId } = (await res.json()) as { storageId: string };
      await createPhoto({
        fileId: storageId as Id<"_storage">,
        caption: caption || undefined,
        album: album || undefined,
        isPublic,
      });
      setCaption("");
      setAlbum("");
      fileInput.value = "";
      alert("Uploaded!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin: Upload Photo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input name="file" type="file" accept="image/*" className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Album</label>
          <input
            type="text"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="e.g. engagement, family"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="size-4"
          />
          Public
        </label>
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>
      </form>
    </main>
  );
}


