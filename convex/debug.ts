import { v } from "convex/values";
import { internalAction, internalQuery } from "./_generated/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const checkAppointment = internalQuery({
    args: { appointmentId: v.optional(v.id("appointments")) },
    handler: async (ctx, args) => {
        let appointment;
        if (args.appointmentId) {
            appointment = await ctx.db.get(args.appointmentId);
        } else {
            appointment = await ctx.db.query("appointments").order("desc").first();
        }

        if (!appointment) return { error: "Appointment not found" };

        const patient = await ctx.db.get(appointment.patientId);
        const doctor = appointment.doctorId ? await ctx.db.get(appointment.doctorId) : null;

        return {
            appointment,
            patient,
            doctor,
            hasPatientEmail: !!patient?.email,
            resendKeyExists: !!process.env.RESEND_API_KEY,
        };
    },
});

export const getLastAppointment = internalQuery({
    args: {},
    handler: async (ctx) => {
        const appointment = await ctx.db.query("appointments").order("desc").first();
        return appointment;
    },
});

export const testEmail = internalAction({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        if (!process.env.RESEND_API_KEY) {
            return { success: false, error: "RESEND_API_KEY is missing" };
        }

        try {
            const { data, error } = await resend.emails.send({
                from: "MedCare Debug <onboarding@resend.dev>",
                to: args.email,
                subject: "Test Email from MedCare",
                html: "<p>This is a test email to verify your configuration.</p>",
            });

            if (error) {
                return { success: false, error };
            }

            return { success: true, data };
        } catch (err) {
            return { success: false, error: err };
        }
    },
});
