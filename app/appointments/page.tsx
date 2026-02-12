"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

export default function AppointmentsPage() {
    const appointments = useQuery(api.appointments.myAppointments);

    if (!appointments) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center">Loading appointments...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Appointments</h1>
            
            {appointments.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">You don't have any appointments yet.</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((appointment) => (
                        <Card key={appointment._id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span className="font-semibold">
                                            {appointment.doctor?.name || "Doctor TBD"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(appointment.date).toLocaleTimeString()}</span>
                                    </div>
                                    {appointment.notes && (
                                        <p className="text-sm mt-2">{appointment.notes}</p>
                                    )}
                                </div>
                                <Badge variant={
                                    appointment.status === "confirmed" ? "default" :
                                    appointment.status === "pending" ? "secondary" :
                                    "destructive"
                                }>
                                    {appointment.status}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
