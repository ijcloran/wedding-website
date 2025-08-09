import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const listPublic = query({
  args: { album: v.optional(v.string()) },
  returns: v.array(
    v.object({
      _id: v.id("photos"),
      caption: v.optional(v.string()),
      url: v.string(),
      album: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const q = ctx.db.query("photos").withIndex("by_album", (ix) =>
      args.album ? ix.eq("album", args.album) : ix.gte("album", "")
    );
    const rows = await q.collect();
    const results: Array<{
      _id: Id<"photos">;
      caption?: string;
      url: string;
      album?: string;
    }> = [];
    for (const r of rows) {
      if (!r.isPublic) continue;
      const url = await ctx.storage.getUrl(r.fileId);
      if (!url) continue;
      results.push({ _id: r._id, caption: r.caption, url, album: r.album });
    }
    return results;
  },
});

export const create = mutation({
  args: {
    fileId: v.id("_storage"),
    caption: v.optional(v.string()),
    album: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  returns: v.id("photos"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("photos", {
      fileId: args.fileId,
      caption: args.caption,
      album: args.album,
      isPublic: args.isPublic,
    });
  },
});


