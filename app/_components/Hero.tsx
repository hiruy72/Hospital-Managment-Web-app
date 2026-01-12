"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from 'convex/react'
import { CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    department: z.string().min(1, { message: "Please select a department." }),
    doctorId: z.string().optional(),
    date: z.string().optional(),
    notes: z.string().optional(),
});

function Hero() {

    const createAppointment = useMutation(api.appointments.createAppointment)

    // Watch department to fetch doctors
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            department: "",
            doctorId: "",
            date: "",
            notes: "",

        },
    });

    const selectedDepartment = form.watch("department");

    const doctors = useQuery(api.doctors.getDoctorsByCategory, {
        category: selectedDepartment || ""
    });


    const onSubmit = (data: z.infer<typeof formSchema>) => {

        try {
            createAppointment({

                department: data.department,
                doctorId: data.doctorId ? (data.doctorId as Id<"doctors">) : undefined,
                date: data.date || new Date().toISOString(),
                notes: data.notes,
            })
            toast.success("Appointment booked successfully!");
            form.reset();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };
    return (
        <div className='relative min-h-[80vh] flex items-center justify-center pt-16 overflow-hidden'>
            {/* Background Image */}

            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Modern Hospital Building"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>

            <div className='container relative z-10 px-4 grid md:grid-cols-2 gap-12 items-center'>
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        Advanced <br />
                        <span className="text-red-600">Medical Care</span>
                    </h1>
                    <p className="text-xl text-gray-200 max-w-lg">
                        Experience world-class healthcare with our expert doctors and state-of-the-art facilities. Your health is our priority.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" className="bg-red-600 hover:bg-red-600/90 text-white border-0">
                            Book Appointment
                        </Button>
                        <Button size="lg" variant="outline" className="text-red-600  ">
                            Our Doctors
                        </Button>
                    </div>
                </div>


                {/* Booking Form Card */}

                <div className="bg-background/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full ml-auto">
                    <h3 className="text-2xl font-semibold mb-6 text-foreground">Quick Booking</h3>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Patient Name" {...field} className="bg-white/5 border-white/10 focus:border-primary" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary">
                                                        <SelectValue placeholder="Department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                    <SelectItem value="Neurology">Neurology</SelectItem>
                                                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Input type="date" className="bg-white/5 border-white/10 focus:border-primary block" />
                            </div>

                            {/* Doctor Selection - Only show if department is selected and doctors are available */}

                            {selectedDepartment && doctors && doctors.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="doctorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary">
                                                        <SelectValue placeholder="Select Doctor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {doctors.map((doctor) => (
                                                        <SelectItem key={doctor._id} value={doctor._id}>
                                                            {doctor.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            )}

                            {/* Notes Field */}

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Please describe your symptoms or any special requirements..."
                                                {...field}
                                                className="bg-white/5 border-white/10 focus:border-primary min-h-[100px] resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                                <CalendarIcon className="mr-2 h-4 w-4" /> Book Now
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>


        </div>
    )
}

export default Hero