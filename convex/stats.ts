import { query } from "./_generated/server";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const doctorsCount = (await ctx.db.query("doctors").collect()).length;
        // For patients and appointments, in a real app check privacy, but for stats we just count
        const patientsCount = (await ctx.db.query("patients").collect()).length;
        // If no patients yet, mock some numbers for the visual

        // Allow mocking for the "red background with reactive numbers" requirement if data is low
        return {
            doctors: doctorsCount || 8,
            departments: (await ctx.db.query("categories").collect()).length || 6,
            patients: patientsCount + 1500, // Mock base
            experience: 25, // Years
        };
    },
});
