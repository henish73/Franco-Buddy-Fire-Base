import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <SectionTitle title="Privacy Policy" subtitle="Your privacy is important to us." />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            FrancoBuddy Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <p>This is a placeholder for the Privacy Policy. It is crucial to replace this with a comprehensive and legally compliant privacy policy before launching your platform.</p>
          
          <h3 className="font-semibold text-foreground pt-2">1. Information We Collect</h3>
          <p>Placeholder: We collect information you provide directly to us, such as when you create an account, enroll in a course, submit a contact form, or book a demo. This may include your name, email address, phone number, TEF goals, French level, and payment information (processed by third-party providers).</p>
          <p>Placeholder: We may also collect information automatically when you use our services, such as IP address, browser type, and usage data through cookies and similar technologies.</p>

          <h3 className="font-semibold text-foreground pt-2">2. How We Use Your Information</h3>
          <p>Placeholder: To provide and improve our services, process enrollments and payments, communicate with you, personalize your learning experience, and for administrative and security purposes.</p>

          <h3 className="font-semibold text-foreground pt-2">3. Information Sharing</h3>
          <p>Placeholder: We do not sell your personal information. We may share information with third-party service providers who assist us in operating our platform (e.g., payment processors, hosting services), with your consent, or as required by law.</p>

          <h3 className="font-semibold text-foreground pt-2">4. Data Security</h3>
          <p>Placeholder: We implement reasonable security measures to protect your information, but no system is completely secure.</p>

          <h3 className="font-semibold text-foreground pt-2">5. Your Rights</h3>
          <p>Placeholder: You may have rights to access, correct, or delete your personal information. Please contact us to exercise these rights.</p>

          <h3 className="font-semibold text-foreground pt-2">6. Cookies</h3>
          <p>Placeholder: We use cookies to enhance your experience. You can control cookie settings through your browser.</p>
          
          <h3 className="font-semibold text-foreground pt-2">7. Changes to This Policy</h3>
          <p>Placeholder: We may update this policy from time to time. We will notify you of significant changes.</p>

          <h3 className="font-semibold text-foreground pt-2">8. Contact Us</h3>
          <p>Placeholder: If you have any questions about this Privacy Policy, please contact us at [Your Contact Email/Page].</p>

          <p className="font-bold text-destructive pt-4">
            IMPORTANT: This is placeholder text. Consult with a legal professional to draft a proper Privacy Policy tailored to your specific operations and legal requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
