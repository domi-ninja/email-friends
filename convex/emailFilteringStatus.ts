import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const createEmailFilteringStatus = mutation({
    args: {
        emailManagedId: v.id("emailsManaged"),
        status: v.string(),
    },
    returns: v.id("emailFilteringStatus"),
    handler: async (ctx, args): Promise<Id<"emailFilteringStatus">> => {
        const emailFilteringStatus = await ctx.db.insert("emailFilteringStatus", {
            emailManagedId: args.emailManagedId,
            status: args.status,
            lastUpdated: Date.now(),
        });



        return emailFilteringStatus;
    }
})

export const lastEmailFilteringStatus = query({
    args: {
        emailManagedId: v.id("emailsManaged"),
    },
    returns: v.union(
        v.object({
            _id: v.id("emailFilteringStatus"),
            _creationTime: v.number(),
            emailManagedId: v.id("emailsManaged"),
            status: v.string(),
            lastUpdated: v.optional(v.number()),
        }),
        v.null()
    ),
    handler: async (ctx, args): Promise<Doc<"emailFilteringStatus"> | null> => {
        const emailFilteringStatus = await ctx.db.query("emailFilteringStatus")
            .withIndex("by_email_managed_id", (q) => q.eq("emailManagedId", args.emailManagedId)).first();
        return emailFilteringStatus;
    }
})

export const getAllEmailFilteringStatuses = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("emailFilteringStatus"),
        _creationTime: v.number(),
        emailManagedId: v.id("emailsManaged"),
        status: v.string(),
        lastUpdated: v.optional(v.number()),
    })),
    handler: async (ctx): Promise<Doc<"emailFilteringStatus">[]> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        // Get all emails managed by the current user
        const emailsManaged = await ctx.db.query("emailsManaged")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .collect();

        // Get all filtering statuses for these emails
        const emailFilteringStatuses = await ctx.db.query("emailFilteringStatus")
            .collect();

        // Filter the statuses to only include those for the user's managed emails
        const userEmailIds = new Set(emailsManaged.map(e => e._id));
        return emailFilteringStatuses.filter(status => userEmailIds.has(status.emailManagedId));
    }
})

// export const ensureEmailManaged = mutation({
//     args: {
//         label: v.string(),
//         emailAddress: v.string(),
//     },
//     returns: v.object({
//         _id: v.id("emailFilteringStatus"),
//         _creationTime: v.number(),
//         emailManagedId: v.id("emailsManaged"),
//         status: v.string(),
//         lastUpdated: v.optional(v.number()),
//     }),
//     handler: async (ctx, args): Promise<Doc<"emailFilteringStatus">> => {

//         const emailFilteringStatus = await ctx.runQuery(api.emailFilteringStatus.by_email_managed_id, {
//             emailManagedId: args.emailManagedId,
//         });
//         if (emailFilteringStatus) {
//             return emailFilteringStatus;
//         }

//         await ctx.runMutation(api.emailFilteringStatus.createEmailFilteringStatus, {


//             return emailFilteringStatus;
//         }
// })