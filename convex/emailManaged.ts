import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
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
        filteringEnabled: v.optional(v.boolean()),
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
        filteringEnabled: v.optional(v.boolean()),
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
        filteringEnabled: v.optional(v.boolean()),
    },
    returns: v.id("emailsManaged"),
    handler: async (ctx, args) => {
        return await ctx.db.insert("emailsManaged", {
            emailAddress: args.emailAddress,
            label: args.label,
            userId: args.userId,
            filteringEnabled: args.filteringEnabled ?? false,
        });
    },
});

export const updateEmailManaged = mutation({
    args: {
        id: v.id("emailsManaged"),
        emailAddress: v.optional(v.string()),
        label: v.optional(v.string()),
        filteringEnabled: v.optional(v.boolean()),
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
        const updates: Partial<{ emailAddress: string; label: string; filteringEnabled: boolean }> = {};
        if (args.emailAddress !== undefined) {
            updates.emailAddress = args.emailAddress;
        }
        if (args.label !== undefined) {
            updates.label = args.label;
        }
        if (args.filteringEnabled !== undefined) {
            updates.filteringEnabled = args.filteringEnabled;
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

export const runFiltering = action({
    args: {
        id: v.id("emailsManaged"),
    },
    returns: v.array(v.object({
        id: v.string(),
        emailManagedId: v.id("emailsManaged"),
        fromServer: v.string(),
        from: v.string(),
        subject: v.string(),
        body: v.string(),
    })),
    handler: async (ctx, args) => {

        await ctx.runMutation(api.emailFilteringStatus.purgeOldEmailFilteringStatuses, {
            emailManagedId: args.id,
        });

        await ctx.runMutation(api.emailFilteringStatus.createEmailFilteringStatus, {
            emailManagedId: args.id,
            status: "Filtering started, accessing gmail",
        });
        // Schedule a delayed completion status update
        await ctx.scheduler.runAfter(2000, api.emailFilteringStatus.createEmailFilteringStatus, {
            emailManagedId: args.id,
            status: "Filtering completed!",
        });

        return [
            {
                id: "1",
                emailManagedId: args.id,
                fromServer: "mail.google.com",
                from: "john@company.com",
                subject: "Nice to see you",
                body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
            {
                id: "2",
                emailManagedId: args.id,
                fromServer: "smtp.amazon.com",
                from: "thomas287138@gmail.com",
                subject: "Great opportunity for you",
                body: "Dear Sir or Madam, I hope this email finds you well. I am writing to you because I think you would be a great fit for our company. We are looking for a new employee and I think you would be a great fit. Please let me know if you are interested.",
            },
            {
                id: "3",
                emailManagedId: args.id,
                fromServer: "mail.facebook.com",
                from: "bob.smith@facebookmail.com",
                subject: "Meeting times",
                body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
        ];
    },
});

export const setFiltering = mutation({
    args: {
        id: v.id("emailsManaged"),
        filteringEnabled: v.boolean(),
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

        // Toggle the filtering state
        await ctx.db.patch(args.id, {
            filteringEnabled: !existingEmail.filteringEnabled,
        });
    },
});

export interface EmailFiltered {
    id: string;
    emailManagedId: Id<"emailsManaged">;
    fromServer: string;
    from: string;
    subject: string;
    body: string;
}

export const ensureEmailManaged = mutation({
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
        filteringEnabled: v.optional(v.boolean()),
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
            filteringEnabled: false,
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

