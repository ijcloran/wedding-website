import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addScore = mutation({
  args: {
    initials: v.string(),
    score: v.number(),
  },
  handler: async (ctx, { initials, score }) => {
    const completedAt = Date.now();
    
    await ctx.db.insert("gameScores", {
      initials: initials.toUpperCase().slice(0, 3),
      score,
      completedAt,
    });
  },
});

export const getTopScores = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    return await ctx.db
      .query("gameScores")
      .order("desc")
      .take(limit);
  },
});

export const getTodaysScores = query({
  handler: async (ctx) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    return await ctx.db
      .query("gameScores")
      .filter((q) => q.gte(q.field("completedAt"), startOfDay.getTime()))
      .order("desc")
      .collect();
  },
});