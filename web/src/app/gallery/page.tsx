"use client";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "#convex/_generated/api";

export default function GalleryPage() {
  const photos = useQuery(api.photos.listPublic, {});
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-serif">Gallery</h1>
      {!photos ? (
        <div>Loading…</div>
      ) : photos.length === 0 ? (
        <div>No photos yet.</div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <li key={p._id} className="overflow-hidden rounded-lg border">
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.url}
                  alt={p.caption ?? "Wedding photo"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              {p.caption ? (
                <div className="p-3 text-sm text-[color:rgba(15,17,19,0.7)]">{p.caption}</div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


