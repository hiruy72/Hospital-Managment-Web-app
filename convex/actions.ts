import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { Resend } from "resend";
import OpenAI from "openai";
import { api } from "./_generated/api";
const resend = new Resend(process.env.RESEND_API_KEY);



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chat = action({
    args: {
        message: v.string(),
        conversationHistory: v.array(
            v.object({
                role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
                content: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        // 1. Get the user's identity (Clerk)
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        // 2. Fetch user's appointments to give AI context
        let appointmentContext = "";
        try {
            // We can use runQuery to call other internal queries
            const appointments = await ctx.runQuery(api.appointments.myAppointments, {});
            if (appointments && appointments.length > 0) {
                appointmentContext = "User's Appointments:\n" + appointments.map(app =>
                    `- ${new Date(app.date).toLocaleString()} with Dr. ${app.doctor?.name} (${app.status})`
                ).join("\n");
            } else {
                appointmentContext = "User has no upcoming appointments.";
            }
        } catch (e) {
            console.error("Failed to fetch appointments for AI context", e);
        }

        const systemPrompt = `You are a helpful medical assistant for MedCare Hospital.
    You can help users check their appointments, find doctors, and get general medical info.
    Important: You are not a doctor. Do not give medical diagnoses.
    If asked about appointments, you have access to their list below.
    Current user: ${identity.name || "Guest"}.

    ${appointmentContext}
    `;

        const messages = [
            { role: "system" as const, content: systemPrompt },
            ...args.conversationHistory.map(m => ({ role: m.role, content: m.content })),
            { role: "user" as const, content: args.message }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or gpt-4
            messages: messages,
        });

        return completion.choices[0].message.content;
    },

})




export const sendAppointmentConfirmationEmail = internalAction({
    args: {
        to: v.string(),
        patientName: v.string(),
        doctorName: v.string(),
        date: v.string(),
        appointmentId: v.string(),
    },
    handler: async (ctx, args) => {
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not set. Cannot send email.");
            return;
        }

        try {
            await resend.emails.send({
                from: "MedCare Appointments <onboarding@resend.dev>", // Using default Resend test domain
                to: args.to,
                subject: "Appointment Confirmed - MedCare Hospital",
                html: `
                    <h1>Appointment Confirmed</h1>
                    <p>Dear ${args.patientName},</p>
                    <p>Your appointment with <strong>Dr. ${args.doctorName}</strong> has been confirmed.</p>
                    <p><strong>Date & Time:</strong> ${args.date}</p>
                    <p>Please arrive 15 minutes early.</p>
                    <p>Reference ID: ${args.appointmentId}</p>
                    <br/>
                    <p>Best regards,<br/>MedCare Hospital Team</p>
                `,
            });
            console.log(`Confirmation email sent to ${args.to}`);
        } catch (error) {
            console.error("Failed to send email", error);
            // Don't throw to avoid failing the mutation completely if email fails? 
            // Better to throw so we know, but user asked for email *after* confirmation.
        }
    },
});
