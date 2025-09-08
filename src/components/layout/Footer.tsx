// src/components/layout/Footer.tsx
import Link from 'next/link';
import { BookMarked, Mail, Phone } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon'; // Ensure this path is correct

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookMarked className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-primary">FrancoBuddy</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your TEF Canada Elite Learning & Success Platform.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Rooted in Brampton, serving Canada.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">Courses</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/guidelines" className="text-sm text-muted-foreground hover:text-primary">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:info@francobuddy.ca" className="text-sm text-muted-foreground hover:text-primary">info@francobuddy.ca</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+1YOURNUMBER" className="text-sm text-muted-foreground hover:text-primary">+1 (XXX) XXX-XXXX</a> {/* Replace with actual number */}
              </li>
              <li className="flex items-center gap-2">
                <WhatsappIcon className="h-5 w-5 text-primary" />
                <a href="https://wa.me/1YOURNUMBER" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">Chat on WhatsApp</a> {/* Replace with actual number */}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} FrancoBuddy TEF Mastery Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
