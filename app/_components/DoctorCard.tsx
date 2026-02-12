"use client"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import React from 'react'
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DoctorCardProps {
    doctor: Doc<"doctors">;
}

function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <Card className='overflow-hidden border-border bg-card/50 hover:bg-card transition-colors hover:border-primary/50 group'>
            <div className='relative h-48 w-full overflow-hidden'>
                <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
                        {doctor.category}
                    </Badge>
                </div>
            </div>

            <CardHeader className='p-4 pb-2'>
                <h3 className="font-bold text-lg truncate">{doctor.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="truncate">{doctor.location}</span>
                </div>
            </CardHeader>



            <CardContent className="p-4 pt-2 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{doctor.experience}+ Years Exp.</span>
                </div>
                {/* Expertise Tags (First 2) */}
                <div className="flex flex-wrap gap-1">
                    {doctor.expertise.slice(0, 2).map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs border-primary/20 text-muted-foreground">
                            {exp}
                        </Badge>
                    ))}
                    {doctor.expertise.length > 2 && (
                        <Badge variant="outline" className="text-xs border-primary/20 text-muted-foreground">+{doctor.expertise.length - 2}</Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link href={`/all-doctors/${doctor._id}`} className="w-full">
                    <Button className="w-full" variant="outline">View Profile</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default DoctorCard