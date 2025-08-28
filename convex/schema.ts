import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gameScores: defineTable({
    initials: v.string(),
    score: v.number(),
    completedAt: v.number(),
  }),
});