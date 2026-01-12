"use client"
import DoctorCard from '@/app/_components/DoctorCard';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

function AllDoctors() {
    const doctors = useQuery(api.doctors.getDoctors);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">All Specialists</h1>
                <p className="text-muted-foreground">Find the right doctor for your needs from our team of experienced specialists.</p>
            </div>

            {!doctors ? (
                // Loading Skeletons
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="h-[380px] w-full rounded-xl border border-border bg-card/50">
                            <Skeleton className="h-48 w-full rounded-t-xl" />
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="space-y-2 pt-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    No doctors found at the moment.
                </div>
            )}
        </div>
    )
}

export default AllDoctors
