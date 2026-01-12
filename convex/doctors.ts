import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDoctorsByCategory = query({
    args: {
        category: v.string(),
    },
    handler: async (ctx, args) => {
        const doctors = await ctx.db
            .query("doctors")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .collect();
        return doctors;
    },
})

export const getDoctors = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("doctors").collect();
    },
});

export const getDoctorById = query({
    args: { id: v.id("doctors") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});


export const createDoctor = mutation({
    args: {
        name: v.string(),
        category: v.string(),
        image: v.string(),
        bio: v.string(),
        expertise: v.array(v.string()),
        experience: v.number(),
        location: v.string(),
        contact: v.string(),
    },
    handler: async (ctx, args) => {
        const newDoctorId = await ctx.db.insert("doctors", args);
        return newDoctorId;
    },
});