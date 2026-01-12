import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    doctors: defineTable({
        name: v.string(),
        category: v.string(), // Matches category name
        image: v.string(),
        bio: v.string(),
        expertise: v.array(v.string()),
        experience: v.number(), // Years of experience
        location: v.string(),
        contact: v.string(),
    })
        .searchIndex("search_name", { searchField: "name" })
        .index("by_category", ["category"]),

    categories: defineTable({
        name: v.string(),
        icon: v.string(), // Lucide icon name
        description: v.optional(v.string()),
    }).index("by_name", ["name"]),

    patients: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(), // Clerk ID
        role: v.union(v.literal("admin"), v.literal("guest")),
    }).index("by_token", ["tokenIdentifier"]),

    appointments: defineTable({
        doctorId: v.optional(v.id("doctors")),
        patientId: v.id("patients"),
        department: v.string(),
        date: v.number(), // Timestamp
        status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled"), v.literal("completed")),
        notes: v.optional(v.string()),
    })
        .index("by_doctor", ["doctorId"])
        .index("by_patient", ["patientId"])
        .index("by_department", ["department"])
        .index("by_status", ["status"]),

});
