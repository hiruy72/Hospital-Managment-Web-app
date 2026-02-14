"use client"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import React from 'react'
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Award, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DoctorCardProps {
    doctor: Doc<"doctors">;
}

function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <Card className='relative overflow-hidden border-2 border-border/50 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group'>
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Image Section */}
            <div className='relative h-64 w-full overflow-hidden'>
                <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-background/95 backdrop-blur-md text-foreground border-2 border-primary/30 shadow-lg px-3 py-1.5 font-semibold">
                        {doctor.category}
                    </Badge>
                </div>

                {/* Rating - Shows on hover */}
                <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-1.5 bg-yellow-500/95 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        <span className="font-bold text-sm">5.0</span>
                    </div>
                </div>

                {/* Bottom info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Award className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">{doctor.experience}+ Years</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <CardHeader className='p-5 pb-3 relative z-10'>
                <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors duration-300 mb-2">
                    {doctor.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{doctor.location}</span>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-4 space-y-4 relative z-10">
                {/* Experience Badge */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="font-bold text-sm">{doctor.experience}+ Years</p>
                    </div>
                </div>

                {/* Expertise Tags */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                        {doctor.expertise.slice(0, 2).map((exp, index) => (
                            <Badge 
                                key={exp} 
                                variant="outline" 
                                className="text-xs border-primary/30 bg-primary/5 text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all cursor-default"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {exp}
                            </Badge>
                        ))}
                        {doctor.expertise.length > 2 && (
                            <Badge 
                                variant="outline" 
                                className="text-xs border-primary/30 bg-primary/5 text-primary font-semibold"
                            >
                                +{doctor.expertise.length - 2}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* Footer with CTA */}
            <CardFooter className="p-5 pt-0 relative z-10">
                <Link href={`/all-doctors/${doctor._id}`} className="w-full">
                    <Button 
                        className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20 relative overflow-hidden" 
                        variant="outline"
                        size="lg"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            View Profile
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </Button>
                </Link>
            </CardFooter>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
    )
}

export default DoctorCard