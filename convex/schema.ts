import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gameScores: defineTable({
    initials: v.string(),
    score: v.number(),
    completedAt: v.number(),
  }).index("by_score", ["score"]),
  photos: defineTable({
    title: v.optional(v.string()), // Make optional since existing data might not have it
    description: v.optional(v.string()),
    album: v.string(), // Match existing field name
    fileId: v.id("_storage"), // Match existing field name (was storageId)
    uploadedAt: v.optional(v.number()), // Make optional since existing data might not have it
    orderIndex: v.optional(v.number()), // For manual ordering
    featured: v.optional(v.boolean()), // For highlighting special photos
    isPublic: v.optional(v.boolean()), // Match existing field
  }),
});