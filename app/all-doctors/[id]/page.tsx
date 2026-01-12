"use client"
import { useParams } from 'next/navigation';
import React from 'react'
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Award, Calendar, MapPin, Phone, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@radix-ui/react-select';
import { Button } from '@/components/ui/button';
import { BookAppointmentModal } from '@/app/_components/BookAppointmentModal';

function page() {
    const params = useParams();
    const doctorId = params.id as Id<"doctors">;
    const doctor = useQuery(api.doctors.getDoctorById, { id: doctorId });

    if (doctor === undefined) {
        return (
            <div className="flex flex-col min-h-screen">

                <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-muted" />
                        <div className="w-48 h-8 rounded bg-muted" />
                        <div className="w-64 h-4 rounded bg-muted" />
                    </div>
                </main>

            </div>
        );
    }

    if (doctor === null) {
        return (
            <div className="flex flex-col min-h-screen">

                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
                        <p className="text-muted-foreground">The requested doctor profile does not exist.</p>
                    </div>
                </main>

            </div>
        );
    }
    return (
        <div className='flex flex-col min-h-screen'>
            {/* Header / Profile Section */}

            <div className='bg-background border-b border-border'>
                <div className='container mx-auto px-4 py-12 flex flex-col md:flex-row gap-10 items-start'>

                    {/* Image */}
                    <div className="relative w-full md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border">
                        <Image
                            src={doctor.image}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Info */}

                    <div className='flex-1 space-y-6'>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="secondary" className="text-sm px-3 py-1">{doctor.category}</Badge>
                                <div className="flex items-center text-yellow-500 gap-1 text-sm font-medium">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>5.0 (42 reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{doctor.name}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{doctor.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    <span>{doctor.experience}+ Years Experience</span>
                                </div>
                            </div>
                        </div>


                        <Separator />

                        <div>
                            <h3 className="text-xl font-semibold mb-3">About</h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {doctor.bio}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {doctor.expertise.map((exp) => (
                                    <Badge key={exp} variant="outline" className="px-3 py-1 text-base">{exp}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <BookAppointmentModal doctorId={doctor._id} doctorName={doctor.name} department={doctor.category} />
                            <Button size="lg" variant="outline" className="flex-1 md:flex-none text-lg px-8">
                                <Phone className="mr-2 w-5 h-5" /> Contact
                            </Button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default page