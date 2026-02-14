"use client"
import DoctorCard from '@/app/_components/DoctorCard';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React, { useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

function AllDoctors() {
    const doctors = useQuery(api.doctors.getDoctors);
    const categories = useQuery(api.categories.get);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredDoctors = doctors?.filter((doctor) => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || doctor.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12 space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Our <span className="text-primary">Medical Specialists</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Find the right doctor for your needs from our team of experienced specialists dedicated to your health and well-being.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="Search by name or expertise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-[200px] h-12">
                            <SelectValue placeholder="All Specialties" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Specialties</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat._id} value={cat.name}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Results Count */}
                {filteredDoctors && (
                    <div className="text-center text-muted-foreground">
                        Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
                    </div>
                )}

                {/* Doctors Grid */}
                {!doctors ? (
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
                ) : filteredDoctors && filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard key={doctor._id} doctor={doctor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-2xl font-semibold text-muted-foreground mb-2">No doctors found</p>
                        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllDoctors
