"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, FileText, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function AppointmentsPage() {
    const appointments = useQuery(api.appointments.myAppointments);

    if (!appointments) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 py-12">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-48 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const upcomingAppointments = appointments.filter(apt => 
        apt.status === "confirmed" || apt.status === "pending"
    );
    const pastAppointments = appointments.filter(apt => 
        apt.status === "completed" || apt.status === "cancelled"
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        My <span className="text-primary">Appointments</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage and track all your medical appointments in one place
                    </p>
                </div>

                {appointments.length === 0 ? (
                    <Card className="p-16 text-center border-2 border-dashed">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">No Appointments Yet</h3>
                        <p className="text-muted-foreground mb-6">Start your healthcare journey by booking your first appointment</p>
                        <a href="/" className="inline-block">
                            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                Book Appointment
                            </button>
                        </a>
                    </Card>
                ) : (
                    <>
                        {/* Upcoming Appointments */}
                        {upcomingAppointments.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-primary rounded-full" />
                                    <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
                                    <Badge variant="secondary" className="ml-2">{upcomingAppointments.length}</Badge>
                                </div>
                                <div className="grid gap-6">
                                    {upcomingAppointments.map((appointment) => (
                                        <Card key={appointment._id} className="p-6 hover:shadow-lg transition-all border-2 hover:border-primary/50">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                {/* Doctor Image */}
                                                {appointment.doctor?.image && (
                                                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20 shrink-0">
                                                        <Image
                                                            src={appointment.doctor.image}
                                                            alt={appointment.doctor.name || "Doctor"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                
                                                {/* Appointment Details */}
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <User className="w-5 h-5 text-primary" />
                                                                <span className="font-bold text-xl">
                                                                    {appointment.doctor?.name || "Doctor TBD"}
                                                                </span>
                                                            </div>
                                                            <Badge variant="outline" className="text-sm">
                                                                {appointment.department}
                                                            </Badge>
                                                        </div>
                                                        <Badge 
                                                            variant={appointment.status === "confirmed" ? "default" : "secondary"}
                                                            className="text-sm px-4 py-1"
                                                        >
                                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-3 text-muted-foreground">
                                                            <Calendar className="w-5 h-5 text-primary" />
                                                            <span className="font-medium">
                                                                {new Date(appointment.date).toLocaleDateString('en-US', { 
                                                                    weekday: 'long', 
                                                                    year: 'numeric', 
                                                                    month: 'long', 
                                                                    day: 'numeric' 
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-muted-foreground">
                                                            <Clock className="w-5 h-5 text-primary" />
                                                            <span className="font-medium">
                                                                {new Date(appointment.date).toLocaleTimeString('en-US', { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {appointment.doctor?.location && (
                                                        <div className="flex items-center gap-3 text-muted-foreground">
                                                            <MapPin className="w-5 h-5 text-primary" />
                                                            <span>{appointment.doctor.location}</span>
                                                        </div>
                                                    )}

                                                    {appointment.notes && (
                                                        <div className="flex items-start gap-3 text-muted-foreground bg-muted/50 p-4 rounded-lg">
                                                            <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-semibold text-foreground mb-1">Notes:</p>
                                                                <p className="text-sm">{appointment.notes}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past Appointments */}
                        {pastAppointments.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-muted-foreground rounded-full" />
                                    <h2 className="text-2xl font-bold text-muted-foreground">Past Appointments</h2>
                                    <Badge variant="outline" className="ml-2">{pastAppointments.length}</Badge>
                                </div>
                                <div className="grid gap-4">
                                    {pastAppointments.map((appointment) => (
                                        <Card key={appointment._id} className="p-6 opacity-75 hover:opacity-100 transition-opacity">
                                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-semibold">
                                                            {appointment.doctor?.name || "Doctor TBD"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge 
                                                    variant={appointment.status === "completed" ? "default" : "destructive"}
                                                    className="h-fit"
                                                >
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
