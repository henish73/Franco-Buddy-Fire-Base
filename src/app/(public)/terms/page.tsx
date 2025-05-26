import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <SectionTitle title="Terms of Service" subtitle="Please read these terms carefully." />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            French.GTA Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <p>This is a placeholder for the Terms of Service. It is crucial to replace this with comprehensive and legally sound terms before launching your platform.</p>
          
          <h3 className="font-semibold text-foreground pt-2">1. Acceptance of Terms</h3>
          <p>Placeholder: By accessing or using the French.GTA platform and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use our services.</p>

          <h3 className="font-semibold text-foreground pt-2">2. Services Provided</h3>
          <p>Placeholder: French.GTA provides online TEF Canada preparation courses, learning materials, and related services as described on our platform.</p>

          <h3 className="font-semibold text-foreground pt-2">3. User Accounts</h3>
          <p>Placeholder: You may need to register for an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>

          <h3 className="font-semibold text-foreground pt-2">4. Payments and Refunds</h3>
          <p>Placeholder: Course fees are as listed on our Pricing page. Payments are processed through third-party providers. Refund policies, if any, will be clearly stated (e.g., typically no refunds after course commencement, or specific conditions for refunds).</p>

          <h3 className="font-semibold text-foreground pt-2">5. Intellectual Property</h3>
          <p>Placeholder: All content on the French.GTA platform, including course materials, text, graphics, logos, and software, is the property of French.GTA or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.</p>

          <h3 className="font-semibold text-foreground pt-2">6. User Conduct</h3>
          <p>Placeholder: You agree to use our services responsibly and not to engage in any activity that is unlawful, harmful, or disruptive. Refer to our Community Guidelines for more details.</p>
          
          <h3 className="font-semibold text-foreground pt-2">7. Disclaimers</h3>
          <p>Placeholder: While we strive to provide high-quality educational services, French.GTA does not guarantee any specific TEF Canada exam results or immigration outcomes. Success depends on individual effort, proficiency, and other factors.</p>

          <h3 className="font-semibold text-foreground pt-2">8. Limitation of Liability</h3>
          <p>Placeholder: To the fullest extent permitted by law, French.GTA shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services.</p>

          <h3 className="font-semibold text-foreground pt-2">9. Changes to Terms</h3>
          <p>Placeholder: We reserve the right to modify these Terms at any time. We will notify you of significant changes. Your continued use of the services after such changes constitutes acceptance of the new Terms.</p>

          <h3 className="font-semibold text-foreground pt-2">10. Governing Law</h3>
          <p>Placeholder: These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law principles.</p>

          <h3 className="font-semibold text-foreground pt-2">11. Contact Us</h3>
          <p>Placeholder: If you have any questions about these Terms, please contact us at [Your Contact Email/Page].</p>

          <p className="font-bold text-destructive pt-4">
            IMPORTANT: This is placeholder text. Consult with a legal professional to draft proper Terms of Service tailored to your specific operations and legal requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
