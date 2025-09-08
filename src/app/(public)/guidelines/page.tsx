import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <SectionTitle title="Community Guidelines" subtitle="Fostering a respectful and productive learning environment." />
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            FrancoBuddy Community Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <p>Welcome to the FrancoBuddy community! To ensure a positive, respectful, and productive learning environment for everyone, we ask all members (students, instructors, and staff) to adhere to the following guidelines. These guidelines apply to all interactions on our platform, including live classes, forums, messaging, and any other communication channels.</p>
          
          <h3 className="font-semibold text-foreground pt-2">1. Be Respectful</h3>
          <p>Placeholder: Treat all members with courtesy and respect. Disagreements may occur, but they should be handled constructively and politely. Harassment, discrimination, bullying, hate speech, or any form of personal attack will not be tolerated.</p>

          <h3 className="font-semibold text-foreground pt-2">2. Stay On Topic</h3>
          <p>Placeholder: Keep discussions and contributions relevant to TEF Canada preparation, French language learning, and related topics. Avoid spamming, off-topic conversations, or excessive self-promotion.</p>

          <h3 className="font-semibold text-foreground pt-2">3. Protect Privacy</h3>
          <p>Placeholder: Do not share personal information of others without their explicit consent. Be mindful of your own privacy and avoid sharing sensitive personal details in public forums.</p>

          <h3 className="font-semibold text-foreground pt-2">4. No Cheating or Plagiarism</h3>
          <p>Placeholder: Academic integrity is paramount. Do not share or solicit exam answers, engage in plagiarism, or any form of academic dishonesty. All submitted work should be your own.</p>

          <h3 className="font-semibold text-foreground pt-2">5. Constructive Feedback</h3>
          <p>Placeholder: When providing feedback to peers or instructors, ensure it is constructive, specific, and aimed at helping others improve. Similarly, be open to receiving constructive feedback.</p>
          
          <h3 className="font-semibold text-foreground pt-2">6. Appropriate Content</h3>
          <p>Placeholder: Do not post or share content that is obscene, defamatory, threatening, infringing on intellectual property rights, or otherwise illegal or inappropriate.</p>

          <h3 className="font-semibold text-foreground pt-2">7. Use of Platform Resources</h3>
          <p>Placeholder: Platform resources, including course materials, are for personal educational use only. Do not distribute, sell, or share these materials outside the FrancoBuddy platform without authorization.</p>

          <h3 className="font-semibold text-foreground pt-2">8. Reporting Violations</h3>
          <p>Placeholder: If you witness or experience a violation of these guidelines, please report it to our support team immediately via [Contact Method, e.g., email or contact form].</p>
          
          <h3 className="font-semibold text-foreground pt-2">9. Consequences of Violations</h3>
          <p>Placeholder: Violations of these guidelines may result in warnings, temporary suspension, or permanent removal from the FrancoBuddy platform, at our sole discretion. We reserve the right to remove any content deemed inappropriate.</p>

          <h3 className="font-semibold text-foreground pt-2">10. Amendments</h3>
          <p>Placeholder: These guidelines may be updated from time to time. Please review them periodically.</p>

          <p className="pt-4">Thank you for helping us create a supportive and enriching learning community at FrancoBuddy!</p>

          <p className="font-bold text-destructive pt-4">
            IMPORTANT: This is placeholder text. Develop these guidelines further to reflect the specific interactions and features of your platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
