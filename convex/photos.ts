import { query } from "./_generated/server";

export const hero = query(async () => {
  // In a real app, you might fetch from a table or storage.
  // For now, return a stable public image path so the client fetches via Convex.
  return {
    url: "/IMG_1310.png",
    alt: "Isaac and Lily",
  } as const;
});



