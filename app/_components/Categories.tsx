
"use client"
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react'
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

function Categories() {
    const categories = useQuery(api.categories.get);

    return (
        <section className='py-20 bg-background'>
            <div className='container mx-auto px-4'>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-primary">Medical Specialties</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We provide specialized medical care across a wide range of departments, ensuring comprehensive treatment for you and your family.
                    </p>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>

                    {categories?.map((category, index) => {


                        const IconComponent = (Icons[category.icon as keyof typeof Icons] || Icons.Activity) as LucideIcon;

                        return (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer flex flex-col items-center justify-center text-center gap-4"
                            >

                                <div className="w-16 h-16 rounded-full bg-red-500 group-hover:bg-red-200 flex items-center justify-center transition-colors">
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>


                            </motion.div>

                        )
                    }) || (
                            // Loading Skeletons  
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
                            ))


                        )}
                </div>
            </div>
        </section>
    )
}

export default Categories