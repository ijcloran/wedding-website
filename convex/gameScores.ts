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
      .withIndex("by_score")
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

export const addGameResponse = mutation({
  args: {
    sessionId: v.string(),
    initials: v.optional(v.string()),
    questionIndex: v.number(),
    questionText: v.string(),
    questionCategory: v.string(),
    userAnswer: v.string(),
    lilyIsaacAnswer: v.string(),
    isMatch: v.boolean(),
  },
  handler: async (ctx, args) => {
    const completedAt = Date.now();
    
    await ctx.db.insert("gameResponses", {
      ...args,
      completedAt,
    });
  },
});

export const updateResponsesWithInitials = mutation({
  args: {
    sessionId: v.string(),
    initials: v.string(),
  },
  handler: async (ctx, { sessionId, initials }) => {
    // Find all responses for this session
    const responses = await ctx.db
      .query("gameResponses")
      .withIndex("by_session", q => q.eq("sessionId", sessionId))
      .collect();
    
    // Update each response with initials
    for (const response of responses) {
      await ctx.db.patch(response._id, {
        initials: initials.toUpperCase().slice(0, 3),
      });
    }
  },
});