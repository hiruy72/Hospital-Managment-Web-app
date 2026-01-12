"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import DoctorCard from './DoctorCard';

function TopDoctors() {
    const doctors = useQuery(api.doctors.getDoctors);

    const topDoctors = doctors ? doctors.slice(0, 4) : [];



    return (
        <section className='py-20 bg-muted/30'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col md:flex-row justify-between items-end mb-10 gap-4'>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Top <span className="text-primary">Specialists</span></h2>
                        <p className="text-muted-foreground max-w-xl">
                            Our team of experienced doctors is dedicated to providing the best possible care for you and your family.
                        </p>
                    </div>

                    <Link href="/all-doctors">
                        <Button variant="ghost" className="gap-2">View All Doctors <ArrowRight className="w-4 h-4" /></Button>
                    </Link>

                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {doctors ? (
                        topDoctors.map((doc) => (
                            <DoctorCard key={doc._id} doctor={doc} />
                        ))
                    ) : (
                        // Loading Skeletons
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-[350px] rounded-xl bg-card border border-border animate-pulse" />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default TopDoctors