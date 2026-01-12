import React from 'react';
import Link from 'next/link';
import { Stethoscope, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: "/", label: "Home" },
        { href: "/doctors", label: "Doctors" },
        { href: "/appointments", label: "Book Appointment" },
        { href: "/about", label: "About Us" },
    ];

    const supportLinks = [
        { href: "/help", label: "Help Center" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/contact", label: "Contact Support" },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
                            <Stethoscope className="w-8 h-8 text-primary" />
                            <span>MedCare</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Providing world-class healthcare with a personal touch. Your health is our priority, delivering compassionate care and advanced medical solutions.
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <a href="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-full">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-full">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-full">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors p-2 bg-gray-800 rounded-full">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                                        <span className="w-1 h-1 bg-primary rounded-full inline-block"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                                        <span className="w-1 h-1 bg-primary rounded-full inline-block"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>123 Healthcare Ave, Medical District, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>support@medcare.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} MedCare. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;