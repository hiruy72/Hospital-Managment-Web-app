"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, GraduationCap, Briefcase, Stethoscope } from 'lucide-react';


const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    category: z.string().min(1, "Please select a category"),
    image: z.string().url("Please enter a valid image URL"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    expertise: z.string().min(1, "Please enter at least one expertise"),
    experience: z.coerce.number().min(0, "Experience must be a positive number"),
    location: z.string().min(5, "Location is required"),
    contact: z.string().min(5, "Contact info is required"),
});

type FormValues = z.infer<typeof formSchema>;


function page() {
    const router = useRouter();
    const categories = useQuery(api.categories.get);
    const createDoctor = useMutation(api.doctors.createDoctor);
    const [previewData, setPreviewData] = useState<FormValues | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            category: "",
            image: "",
            bio: "",
            expertise: "",
            experience: 0,
            location: "",
            contact: "",
        },
        mode: "onChange",
    });
    // Update preview when form values change

    React.useEffect(() => {
        const subscription = form.watch((value) => {
            setPreviewData(value as FormValues);
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);


    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            await createDoctor({
                ...values,
                expertise: values.expertise.split(',').map(item => item.trim()),
            });
            toast.success("Doctor added successfully!");
            router.push("/admin/appointments"); // Redirect to doctors list (or admin list)
        } catch (error) {
            console.error("Failed to add doctor:", error);
            toast.error("Failed to add doctor. Please try again.");
        }
    };


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Add New Doctor</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor Details</CardTitle>
                        <CardDescription>Fill in the form below to add a new doctor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" {...form.register("name")} placeholder="Dr. John Doe" />
                                {form.formState.errors.name && <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="category">Specialty</Label>
                                <Select onValueChange={(value) => form.setValue("category", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((cat) => (
                                            <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.category && <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="image">Profile Image URL</Label>
                                <Input id="image" {...form.register("image")} placeholder="https://example.com/doctor.jpg" />
                                {form.formState.errors.image && <p className="text-red-500 text-sm mt-1">{form.formState.errors.image.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="experience">Experience (Years)</Label>
                                    <Input type="number" id="experience" {...form.register("experience")} />
                                    {form.formState.errors.experience && <p className="text-red-500 text-sm mt-1">{form.formState.errors.experience.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="contact">Contact Info</Label>
                                    <Input id="contact" {...form.register("contact")} placeholder="Email or Phone" />
                                    {form.formState.errors.contact && <p className="text-red-500 text-sm mt-1">{form.formState.errors.contact.message}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="location">Location/Hospital</Label>
                                <Input id="location" {...form.register("location")} placeholder="City Hospital, NY" />
                                {form.formState.errors.location && <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="expertise">Expertise (Comma separated)</Label>
                                <Input id="expertise" {...form.register("expertise")} placeholder="Cardiology, Heart Surgery, etc." />
                                {form.formState.errors.expertise && <p className="text-red-500 text-sm mt-1">{form.formState.errors.expertise.message}</p>}
                            </div>

                            <div>
                                <Label htmlFor="bio">Biography</Label>
                                <Textarea id="bio" {...form.register("bio")} placeholder="Short biography..." className="h-32" />
                                {form.formState.errors.bio && <p className="text-red-500 text-sm mt-1">{form.formState.errors.bio.message}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Adding Doctor..." : "Add Doctor"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Live Preview Section */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-gray-400">Live Preview</h2>
                    {previewData ? (
                        <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
                            <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
                                {previewData.image ? (
                                    <img
                                        src={previewData.image}
                                        alt={previewData.name || "Doctor Preview"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL' }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Stethoscope className="w-16 h-16 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                    {previewData.category || "Specialty"}
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl text-primary">{previewData.name || "Doctor Name"}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Briefcase className="w-4 h-4" />
                                            {previewData.experience || 0} Years Experience
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                    {previewData.location || "Location"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Phone className="w-4 h-4" />
                                    {previewData.contact || "Contact"}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> Expertise
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {previewData.expertise ? (
                                            previewData.expertise.split(',').map((skill, index) => (
                                                skill.trim() && (
                                                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                        {skill.trim()}
                                                    </span>
                                                )
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">No expertise listed</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">About</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                        {previewData.bio || "Doctor biography will appear here..."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
                            Start typing to see preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page