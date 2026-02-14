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
        <div className='flex flex-col min-h-screen bg-gradient-to-b from-background via-muted/10 to-background'>
            {/* Header / Profile Section */}

            <div className='bg-card/50 backdrop-blur-sm border-b border-border'>
                <div className='container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12 items-start'>

                    {/* Image */}
                    <div className="relative w-full lg:w-96 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20 group">
                        <Image
                            src={doctor.image}
                            alt={doctor.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* Info */}

                    <div className='flex-1 space-y-8'>
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge variant="secondary" className="text-base px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                                    {doctor.category}
                                </Badge>
                                <div className="flex items-center text-yellow-500 gap-1.5 text-base font-semibold">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span>5.0</span>
                                    <span className="text-muted-foreground font-normal">(42 reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                                {doctor.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-primary" />
                                    <span>{doctor.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-6 h-6 text-primary" />
                                    <span className="font-semibold text-foreground">{doctor.experience}+</span> Years Experience
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-border" />

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <div className="w-1 h-8 bg-primary rounded-full" />
                                About
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {doctor.bio}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <div className="w-1 h-8 bg-primary rounded-full" />
                                Areas of Expertise
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {doctor.expertise.map((exp, index) => (
                                    <Badge 
                                        key={exp} 
                                        variant="outline" 
                                        className="px-4 py-2 text-base border-2 hover:bg-primary/10 hover:border-primary transition-colors cursor-default"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {exp}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <BookAppointmentModal doctorId={doctor._id} doctorName={doctor.name} department={doctor.category} />
                            <Button size="lg" variant="outline" className="flex-1 sm:flex-none text-lg px-8 h-14 border-2 hover:bg-primary/5">
                                <Phone className="mr-2 w-5 h-5" /> {doctor.contact}
                            </Button>
                        </div>

                    </div>

                </div>
            </div>

            {/* Additional Info Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-bold text-xl mb-2">Available Today</h4>
                        <p className="text-muted-foreground">Book your appointment now</p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-bold text-xl mb-2">Board Certified</h4>
                        <p className="text-muted-foreground">Verified credentials</p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-primary fill-primary" />
                        </div>
                        <h4 className="font-bold text-xl mb-2">Top Rated</h4>
                        <p className="text-muted-foreground">Excellent patient reviews</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page