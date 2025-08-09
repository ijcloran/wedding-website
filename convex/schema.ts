import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  households: defineTable({
    name: v.string(),
    note: v.optional(v.string()),
    inviteCode: v.string(),
  }).index("by_inviteCode", ["inviteCode"]),

  guests: defineTable({
    householdId: v.id("households"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    isChild: v.boolean(),
  }).index("by_household", ["householdId"]),

  rsvps: defineTable({
    householdId: v.id("households"),
    responses: v.array(
      v.object({
        guestId: v.id("guests"),
        attending: v.boolean(),
        mealChoice: v.optional(v.string()),
        notes: v.optional(v.string()),
      })
    ),
    songRequests: v.optional(v.array(v.string())),
    submittedAt: v.number(),
  }).index("by_household", ["householdId"]),

  photos: defineTable({
    album: v.optional(v.string()),
    fileId: v.id("_storage"),
    caption: v.optional(v.string()),
    uploadedByIp: v.optional(v.string()),
    isPublic: v.boolean(),
  }).index("by_album", ["album"]),
});


