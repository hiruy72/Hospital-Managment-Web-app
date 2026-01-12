import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createAppointment = mutation({
    args: {
        department: v.string(),
        doctorId: v.optional(v.id("doctors")),
        date: v.string(), // ISO string or timestamp passed as string from form
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Check if patient exists, if not create
        let patient = await ctx.db.query("patients").withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

        if (!patient) {
            const id = await ctx.db.insert("patients", {
                name: identity.name || "User",
                email: identity.email || "",
                tokenIdentifier: identity.tokenIdentifier,
                role: "guest",

            });
            patient = await ctx.db.get(id);
        }
        if (!patient) throw new Error("Could not create patient");

        const appointmentId = await ctx.db.insert("appointments", {
            department: args.department,
            patientId: patient._id,
            doctorId: args.doctorId,
            date: new Date(args.date).getTime(),
            status: "pending",
            notes: args.notes,
        });

        return appointmentId;
    }

})



export const updateStatus = mutation({
    args: {
        appointmentId: v.id("appointments"),
        status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        // In a real app, verify user is admin/doctor or the owner
        // For now, allowing update (or we could check strict roles if roles existed)

        const appointment = await ctx.db.get(args.appointmentId);
        if (!appointment) throw new Error("Appointment not found");

        await ctx.db.patch(args.appointmentId, { status: args.status });

        // If newly confirmed, send email
        if (args.status === "confirmed" && appointment.status !== "confirmed") {
            const patient = await ctx.db.get(appointment.patientId);
            const doctor = appointment.doctorId
                ? await ctx.db.get(appointment.doctorId)
                : null;

            if (patient && patient.email && doctor) {
                // Use scheduler to call the action
                await ctx.scheduler.runAfter(0, internal.actions.sendAppointmentConfirmationEmail, {
                    to: patient.email,
                    patientName: patient.name,
                    doctorName: doctor.name,
                    date: new Date(appointment.date).toLocaleString(),
                    appointmentId: appointment._id,
                });
            }
        }
    },
});


export const getAppointments = query({
    args: {},
    handler: async (ctx) => {
        const appointments = await ctx.db.query("appointments").order("desc").collect();
        return Promise.all(
            appointments.map(async (appointment) => {
                const doctor = appointment.doctorId ? await ctx.db.get(appointment.doctorId) : null;
                const patient = await ctx.db.get(appointment.patientId);
                return {
                    ...appointment,
                    doctor,
                    patient,
                };
            })
        );
    },
});
export const myAppointments = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];


        const patient = await ctx.db
            .query("patients")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .first();


        if (!patient) return [];


        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_patient", (q) => q.eq("patientId", patient._id))
            .collect();

        // Join with doctor details

        const appointmentsWithDoctor = await Promise.all(

            appointments.map(async (app) => {
                const doctor = app.doctorId ? await ctx.db.get(app.doctorId) : null;
                return {
                    ...app,
                    doctor,
                };
            })
        )

        return appointmentsWithDoctor;

    }
})