// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { Logo } from '@/components/icons/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-secondary via-background to-background text-foreground border-t border-border">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl">FRANCOBUDDY</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your TEF Canada Elite Learning & Success Platform.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Serving Toronto & GTA, Ontario, Canada.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">About Us</Link></li>
              <li><Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Courses</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">FAQ</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Terms of Service</Link></li>
              <li><Link href="/guidelines" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:frenchgta.ca@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">frenchgta.ca@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+13653062049" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">+1 (365) 306-2049</a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsappIcon className="h-5 w-5 text-primary" />
                <a href="https://wa.me/13653062049" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-opacity">Chat on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-foreground/10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} FRANCOBUDDY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}