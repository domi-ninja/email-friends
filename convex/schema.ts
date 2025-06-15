import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  emailsManaged: defineTable({
    emailAddress: v.string(),
    label: v.string(),
    userId: v.string(),
    filteringEnabled: v.optional(v.boolean()),
  }).index("by_email_address", ["emailAddress"]),

  emailFilteringStatus: defineTable({
    emailManagedId: v.id("emailsManaged"),
    status: v.string(),
    lastUpdated: v.optional(v.number()),
  }).index("by_email_managed_id", ["emailManagedId"]),
});
