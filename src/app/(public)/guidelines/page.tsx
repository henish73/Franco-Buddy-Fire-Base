import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function GuidelinesPage() {
  return (
    <>
    {/* Hero Section */}
      <section className="relative h-80">
        <Image 
          src="https://picsum.photos/1920/1080?random=10" 
          alt="Community guidelines" 
          className="object-cover w-full h-full"
          fill
          data-ai-hint="community people group"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <Users className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold">Community Guidelines</h1>
            <p className="text-lg md:text-xl mt-4 max-w-2xl">
              Fostering a respectful and productive learning environment.
            </p>
          </div>
        </div>
      </section>
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            FRANCOBUDDY Guidelines and Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground leading-relaxed prose prose-lg dark:prose-invert max-w-none">
            <p>At FRANCOBUDDY, we are committed to providing a safe, respectful, and effective learning environment for all students, teachers, and staff. Please review our comprehensive guidelines and policies below.</p>
            <h2>1. Student Conduct</h2>
            <ul>
                <li>Be respectful to instructors, staff, and fellow students at all times.</li>
                <li>Participate actively and positively in all classes and activities.</li>
                <li>Use appropriate language and behavior in all communications.</li>
                <li>Do not engage in disruptive, harassing, or discriminatory behavior.</li>
            </ul>
            <h2>2. Teacher Conduct</h2>
            <ul>
                <li>Provide high-quality, professional instruction and support.</li>
                <li>Foster an inclusive and respectful classroom environment.</li>
                <li>Maintain confidentiality of student information.</li>
                <li>Report any concerns or violations to administration promptly.</li>
            </ul>
            <h2>3. Online Class Etiquette</h2>
            <ul>
                <li>Join classes on time and be prepared with necessary materials.</li>
                <li>Mute your microphone when not speaking to minimize background noise.</li>
                <li>Dress appropriately for video sessions.</li>
                <li>Use the chat and other tools respectfully and constructively.</li>
            </ul>
            <h2>4. Anti-Harassment and Discrimination</h2>
            <ul>
                <li>Harassment, bullying, or discrimination of any kind will not be tolerated.</li>
                <li>Report any incidents to <a href="mailto:frenchgta.ca@gmail.com">frenchgta.ca@gmail.com</a> immediately.</li>
            </ul>
            <h2>5. Academic Honesty</h2>
            <ul>
                <li>All work submitted must be your own.</li>
                <li>Do not engage in cheating, plagiarism, or unauthorized collaboration.</li>
            </ul>
            <h2>6. Attendance and Participation</h2>
            <ul>
                <li>Regular attendance is expected for all enrolled courses.</li>
                <li>Notify your instructor in advance if you must miss a class.</li>
                <li>Active participation is essential for language learning success.</li>
            </ul>
            <h2>7. Payment and Refund Policy</h2>
            <ul>
                <li>All course fees must be paid in advance unless otherwise stated.</li>
                <li>Refunds are subject to our refund policy. Contact <a href="mailto:frenchgta.ca@gmail.com">frenchgta.ca@gmail.com</a> for details.</li>
            </ul>
            <h2>8. Technology Use</h2>
            <ul>
                <li>Use the online platform and resources for educational purposes only.</li>
                <li>Do not share your login credentials or access with others.</li>
                <li>Do not attempt to disrupt or compromise the security of our systems.</li>
            </ul>
            <h2>9. Privacy and Confidentiality</h2>
            <ul>
                <li>Respect the privacy of others. Do not record or share classes without permission.</li>
                <li>Personal information is handled according to our <Link href="/privacy">Privacy Policy</Link>.</li>
            </ul>
            <h2>10. Reporting Issues</h2>
            <ul>
                <li>If you experience or witness any inappropriate behavior, technical issues, or policy violations, report them to <a href="mailto:frenchgta.ca@gmail.com">frenchgta.ca@gmail.com</a> immediately.</li>
            </ul>
            <h2>11. Disciplinary Actions</h2>
            <ul>
                <li>Violations of these guidelines may result in warnings, suspension, or removal from courses without refund.</li>
                <li>Serious violations may be reported to appropriate authorities.</li>
            </ul>
            <h2>12. Updates to Guidelines</h2>
            <p>We may update these guidelines and policies as needed. Please review them regularly for any changes.</p>
            <h2>13. Contact Us</h2>
            <p>If you have any questions or concerns about these guidelines, please contact us at <a href="mailto:frenchgta.ca@gmail.com">frenchgta.ca@gmail.com</a>.</p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
