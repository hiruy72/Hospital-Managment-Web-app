import { internalMutation } from "./_generated/server";

export const addField = internalMutation({
    args: {},
    handler: async (ctx) => {
        // 1. Get all records
        const records = await ctx.db.query("patients").collect();

        // 2. Loop through and add the field if missing
        for (const record of records) {
            if (record.role === undefined) {
                await ctx.db.patch(record._id, { role: "guest" }); // Default value
            }
        }
    },
});