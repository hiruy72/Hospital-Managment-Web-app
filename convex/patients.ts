import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createUser without authentication present");
        }

        const user = await ctx.db
            .query("patients")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (user !== null) {
            // If we've seen this user before but perhaps their name or email changed, update it
            // For now, we just return the user id
            return user._id;
        }

        // If it's a new user, create a new record
        const newUserId = await ctx.db.insert("patients", {
            name: args.name,
            email: args.email,
            tokenIdentifier: identity.tokenIdentifier,
            role: "guest",

        });

        return newUserId;
    },
});

export const getUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("patients")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        return user;
    },
});

export const setRole = mutation({
    args: {
        userId: v.id("patients"),
        role: v.union(v.literal("admin"), v.literal("guest")),
    },
    handler: async (ctx, args) => {
        // You might want to add authentication/authorization checks here later
        // ensuring only admins can change roles.
        // For bootstrapping, we'll allow it for now or rely on Convex dashboard execution.
        await ctx.db.patch(args.userId, { role: args.role });
    },
});