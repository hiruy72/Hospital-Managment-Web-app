"use client";
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import Link from 'next/link';
import React from 'react'

function AppointmentAdmin() {
    const appointments = useQuery(api.appointments.getAppointments);
    const updateStatus = useMutation(api.appointments.updateStatus);

    const handleStatusUpdate = async (
        id: Id<"appointments">,
        status: "confirmed" | "cancelled" | "completed"
    ) => {
        await updateStatus({ appointmentId: id, status });
    }

    if (!appointments) {
        return <div className="p-10 text-center">Loading appointments...</div>;
    }
    return (
        <div className='container mx-auto p-10'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className="text-3xl font-bold mb-8">Appointment Management</h1>
                <Link href="/admin/doctors/add">
                    <Button>Add Doctort</Button>
                </Link>
            </div>
            <div className='bg-white rounded-lg shadow overflow-hidden'>

                <table className='min-w-full divide-y divide-gray-200'>


                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className='bg-white divide-y divide-gray-200'>
                        {appointments?.map((apt) => (
                            <tr key={apt._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(apt.date).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{apt.patient?.name || "Unknown"}</div>
                                    <div className="text-sm text-gray-500">{apt.patient?.email}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Dr. {apt.doctor?.name || "Unassigned"}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {apt.department}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {apt.status}
                                    </span>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                    {apt.status === 'pending' && (
                                        <div className='flex space-x-2'>
                                            <button
                                                onClick={() => handleStatusUpdate(apt._id, "confirmed")}
                                                className="text-green-600 hover:text-green-900 border border-green-600 px-3 py-1 rounded hover:bg-green-50"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(apt._id, "cancelled")}
                                                className="text-red-600 hover:text-red-900 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    {apt.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, "completed")}
                                            className="text-blue-600 hover:text-blue-900 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50"
                                        >
                                            Mark Complete
                                        </button>
                                    )}

                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AppointmentAdmin