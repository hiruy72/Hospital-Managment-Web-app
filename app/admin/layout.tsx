"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConvexAuth } from "convex/react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const user = useQuery(api.patients.getUser);
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Wait for auth to load

        if (!isAuthenticated) {
            router.push("/");
            return;
        }

        // optimizing this check might be needed if user is loaded async after auth
        // but typically user hook will load shortly after auth
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (user === undefined) return; // Loading user
        if (user === null || user.role !== "admin") {
            router.push("/");
        }
    }, [user, router]);


    if (isLoading || user === undefined) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    // Double check in render to avoid flash of content
    if (!isAuthenticated || !user || user.role !== "admin") {
        return null;
    }

    return <>{children}</>;
}
