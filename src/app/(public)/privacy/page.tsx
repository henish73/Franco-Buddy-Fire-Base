import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <>
    {/* Hero Section */}
      <section className="relative h-80">
        <Image 
          src="https://picsum.photos/1920/1080?random=8" 
          alt="Privacy and security" 
          className="object-cover w-full h-full"
          fill
          data-ai-hint="security lock abstract"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Privacy Policy</h1>
            <p className="text-lg md:text-xl mt-4 max-w-2xl">
              Your privacy is important to us.
            </p>
          </div>
        </div>
      </section>
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            FRANCOBUDDY Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed prose prose-lg dark:prose-invert max-w-none">
            <p>Your privacy is important to us. This Privacy Policy explains how FRANCOBUDDY collects, uses, shares, and protects your personal information when you use our website and services.</p>
            <h2>1. Information We Collect</h2>
            <ul>
                <li><strong>Personal Information:</strong> Name, email, phone number, address, payment details, and any information you provide when registering, enrolling, or contacting us.</li>
                <li><strong>Usage Data:</strong> Pages visited, actions taken, IP address, browser type, device information, and access times.</li>
                <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance your experience and analyze site usage.</li>
            </ul>
            <h2>2. How We Use Your Information</h2>
            <ul>
                <li>To provide, operate, and improve our courses and services.</li>
                <li>To communicate with you about your account, classes, or inquiries.</li>
                <li>To process payments and manage enrollments.</li>
                <li>To send updates, newsletters, or promotional materials (you can opt out anytime).</li>
                <li>To comply with legal obligations and enforce our terms.</li>
            </ul>
            <h2>3. Cookies and Analytics</h2>
            <ul>
                <li>We use cookies to remember your preferences and analyze site traffic.</li>
                <li>We may use third-party analytics tools (such as Google Analytics) to collect and analyze usage data.</li>
                <li>You can control cookies through your browser settings.</li>
            </ul>
            <h2>4. Data Sharing and Third Parties</h2>
            <ul>
                <li>We do not sell your personal information.</li>
                <li>We may share data with trusted service providers (e.g., payment processors, email services) who help us operate our business, under strict confidentiality agreements.</li>
                <li>We may disclose information if required by law or to protect our rights and safety.</li>
            </ul>
            <h2>5. User Rights</h2>
            <ul>
                <li>You may request access to, correction, or deletion of your personal data by contacting us.</li>
                <li>You can opt out of marketing communications at any time.</li>
            </ul>
            <h2>6. Data Security</h2>
            <ul>
                <li>We use reasonable technical and organizational measures to protect your data.</li>
                <li>No method of transmission over the Internet is 100% secure; we cannot guarantee absolute security.</li>
            </ul>
            <h2>7. International Transfers</h2>
            <p>Your information may be transferred to and processed in countries outside your own. We take steps to ensure your data is protected according to this policy.</p>
            <h2>8. Children's Privacy</h2>
            <p>We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us for removal.</p>
            <h2>9. Data Retention</h2>
            <p>We retain your information as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website. Please review it periodically.</p>
            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or your data, please contact us at <a href="mailto:frenchgta.ca@gmail.com">frenchgta.ca@gmail.com</a>.</p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
