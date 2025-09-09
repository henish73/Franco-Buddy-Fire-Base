// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { Logo } from '@/components/icons/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary to-blue-800 text-primary-foreground border-t border-blue-900">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl">FRANCOBUDDY</span>
            </Link>
            <p className="text-sm opacity-80">
              Your TEF Canada Elite Learning & Success Platform.
            </p>
            <p className="text-sm opacity-80 mt-2">
              Serving Toronto & GTA, Ontario, Canada.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link href="/courses" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Courses</Link></li>
              <li><Link href="/pricing" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm opacity-80 hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link href="/blog" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Terms of Service</Link></li>
              <li><Link href="/guidelines" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-secondary" />
                <a href="mailto:frenchgta.ca@gmail.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity">frenchgta.ca@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-secondary" />
                <a href="tel:+13653062049" className="text-sm opacity-80 hover:opacity-100 transition-opacity">+1 (365) 306-2049</a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsappIcon className="h-5 w-5 text-secondary" />
                <a href="https://wa.me/13653062049" target="_blank" rel="noopener noreferrer" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Chat on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm opacity-80">
            &copy; {currentYear} FRANCOBUDDY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
