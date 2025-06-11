import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { action, mutation, query } from "./_generated/server";

// Email management functions
export const getEmailsManaged = query({
    args: {
    },
    returns: v.array(v.object({
        _id: v.id("emailsManaged"),
        _creationTime: v.number(),
        emailAddress: v.string(),
        label: v.string(),
        userId: v.string(),
    })),
    handler: async (ctx, args): Promise<Doc<"emailsManaged">[]> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const emailManaged = await ctx.db.query("emailsManaged").filter((q) => q.eq(q.field("userId"), identity.subject)).collect();
        return emailManaged;
    },
});

// Email management functions
export const getEmailManaged = query({
    args: {
        emailAddress: v.string(),
    },
    returns: v.union(v.object({
        _id: v.id("emailsManaged"),
        _creationTime: v.number(),
        emailAddress: v.string(),
        label: v.string(),
        userId: v.string(),
    }), v.null()),
    handler: async (ctx, args): Promise<Doc<"emailsManaged"> | null> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const emailAddress = args.emailAddress;
        const emailManaged = await ctx.db.query("emailsManaged").filter((q) => q.eq(q.field("emailAddress"), emailAddress) && q.eq(q.field("userId"), identity.subject)).first();
        return emailManaged;
    },
});

export const createEmailManaged = mutation({
    args: {
        emailAddress: v.string(),
        label: v.string(),
        userId: v.string(),
    },
    returns: v.id("emailsManaged"),
    handler: async (ctx, args) => {
        return await ctx.db.insert("emailsManaged", {
            emailAddress: args.emailAddress,
            label: args.label,
            userId: args.userId,
        });
    },
});

export const updateEmailManaged = mutation({
    args: {
        id: v.id("emailsManaged"),
        emailAddress: v.optional(v.string()),
        label: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        // Check if the email belongs to the current user
        const existingEmail = await ctx.db.get(args.id);
        if (!existingEmail) {
            throw new Error("Email not found");
        }
        if (existingEmail.userId !== identity.subject) {
            throw new Error("Not authorized to update this email");
        }

        // Build update object with only provided fields
        const updates: Partial<{ emailAddress: string; label: string }> = {};
        if (args.emailAddress !== undefined) {
            updates.emailAddress = args.emailAddress;
        }
        if (args.label !== undefined) {
            updates.label = args.label;
        }

        await ctx.db.patch(args.id, updates);
        return null;
    },
});

export const deleteEmailManaged = mutation({
    args: {
        id: v.id("emailsManaged"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        // Check if the email belongs to the current user
        const existingEmail = await ctx.db.get(args.id);
        if (!existingEmail) {
            throw new Error("Email not found");
        }
        if (existingEmail.userId !== identity.subject) {
            throw new Error("Not authorized to delete this email");
        }

        await ctx.db.delete(args.id);
        return null;
    },
});

export const ensureEmailManaged = action({
    args: {
        label: v.string(),
        emailAddress: v.string(),
    },
    returns: v.object({
        _id: v.id("emailsManaged"),
        _creationTime: v.number(),
        emailAddress: v.string(),
        label: v.string(),
        userId: v.string(),
    }),
    handler: async (ctx, args): Promise<Doc<"emailsManaged">> => {

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const emailAddress = args.emailAddress;
        const emailManaged = await ctx.runQuery(api.emailManaged.getEmailManaged, {
            emailAddress,
        });
        if (emailManaged) {
            return emailManaged;
        }

        await ctx.runMutation(api.emailManaged.createEmailManaged, {
            emailAddress,
            label: args.label,
            userId: identity.subject,
        });

        const emailManaged2 = await ctx.runQuery(api.emailManaged.getEmailManaged, {
            emailAddress,
        });

        if (!emailManaged2) {
            throw new Error(`Ensure email managed failed for ${emailAddress} ${args}`);
        }

        return emailManaged2;
    },
});