"use client";

import Link from "next/link";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { isSignedIn } = useAuth();
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/all-doctors", label: "Doctors" },
        { href: "/appointments", label: "My Appointments" },
    ];

    return (
        <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Stethoscope className="w-8 h-8" />
                    <span>MedCare</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex">
                        {/* Additional placeholder for desktop specific items if needed */}
                    </div>

                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <div className="flex gap-2">
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">Log in</Button>
                            </SignInButton>
                            <SignInButton mode="modal">
                                <Button size="sm">Sign up</Button>
                            </SignInButton>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
