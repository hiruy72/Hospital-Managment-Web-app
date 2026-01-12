"use client";
import { ClerkProvider, useAuth, useUser } from '@clerk/nextjs'
import { Authenticated, ConvexReactClient, useMutation } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import React, { useEffect } from 'react'
import { api } from '@/convex/_generated/api';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
function ConvexClientProvider({ children }: { children: React.ReactNode }) {

    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth} >
                <Authenticated>
                    <UserSync />
                </Authenticated>
                {children}

            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

function UserSync() {
    const { user } = useUser();
    const createUser = useMutation(api.patients.createUser);

    useEffect(() => {
        if (user) {
            console.log("UserSync: User found:", user);
            const userInfo = {
                name: user.fullName || user.firstName || "Anonymous",
                email: user.emailAddresses[0]?.emailAddress || "",
            };
            console.log("UserSync: Syncing user to Convex:", userInfo);
            createUser(userInfo)
                .then((id) => console.log("UserSync: Created/Updated user:", id))
                .catch((err) => console.error("UserSync: Error creating user:", err));
        } else {
            console.log("UserSync: No user found (yet).");
        }
    }, [user, createUser])
    return null;
}

export default ConvexClientProvider