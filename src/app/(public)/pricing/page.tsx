import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, HelpCircle, CreditCard } from 'lucide-react';

// Placeholder data - In a real app, this would come from Firestore or config
const pricingTiers = [
  {
    courseName: "TEF Foundation",
    courseId: "tef-foundation",
    targetCLB: "4-6",
    price1on1: 500,
    price1on3: 300,
    features: [
      "Comprehensive fundamental coverage",
      "Introduction to all TEF sections",
      "Regular progress tracking",
      "Access to basic learning materials",
    ],
    imageAiHint: "education learning",
  },
  {
    courseName: "TEF Pro - CLB 7+",
    courseId: "tef-pro-clb7",
    targetCLB: "7+",
    price1on1: 800,
    price1on3: 550,
    features: [
      "Advanced strategies for high scores",
      "Intensive practice & mock tests",
      "Personalized feedback sessions",
      "Focus on CLB 7+ requirements",
    ],
    imageAiHint: "success achievement",
  },
  {
    courseName: "TEF Excellence - CLB 9+",
    courseId: "tef-excellence-clb9",
    targetCLB: "9+",
    price1on1: 1200,
    features: [
      "Elite 1:1 coaching for top scores",
      "Customized advanced curriculum",
      "In-depth error analysis & refinement",
      "Focus on nuances for CLB 9+",
    ],
    is1on3Available: false, // Example: This course only has 1:1
    imageAiHint: "award certificate",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transparent Pricing</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Invest in your future with our clear and competitive TEF Canada course fees. No hidden costs, just pure value.
          </p>
        </div>
      </section>

      {/* Simplified Pricing Tiers Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Course Packages" subtitle="Find the perfect plan to match your TEF Canada goals and budget." />
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier) => (
              <Card key={tier.courseId} className="flex flex-col shadow-xl hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center bg-muted/30 py-8">
                  <CardTitle className="text-2xl text-primary">{tier.courseName}</CardTitle>
                  <CardDescription>Target CLB: {tier.targetCLB}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-8 px-6 space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-foreground mb-1">1:1 Personal Coaching</h4>
                    <p className="text-4xl font-bold text-accent">${tier.price1on1}</p>
                    <p className="text-xs text-muted-foreground">Full Course Fee</p>
                  </div>
                  
                  {tier.is1on3Available !== false && tier.price1on3 && (
                     <div className="text-center">
                        <h4 className="text-lg font-semibold text-foreground mb-1">1:3 Small Group</h4>
                        <p className="text-4xl font-bold text-accent">${tier.price1on3}</p>
                        <p className="text-xs text-muted-foreground">Per Participant, Full Course Fee</p>
                      </div>
                  )}
                  
                  <ul className="space-y-3 pt-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-px shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto p-6">
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/courses/${tier.courseId}`}>Learn More & Enroll</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Payment Methods" subtitle="Convenient and secure options to get you started." />
          <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="text-center p-6 shadow-lg">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Interac e-Transfer</h3>
              <p className="text-muted-foreground">Our primary and preferred method for simple and secure payments within Canada.</p>
            </Card>
            <Card className="text-center p-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-primary mx-auto mb-4">
                <path d="M7.534 16.775c.488 0 .912-.122 1.27-.365.357-.244.62-.61.788-1.098l.122-.55C9.844 14.068 10.2 13 10.89 13h2.44c1.463 0 2.05.805 2.05 1.951 0 .537-.147.976-.44 1.317-.292.342-.683.512-1.17.512H12.5v1.976h-1.756v-2.073h-1.214c-.89 0-1.61-.231-2.158-.695-.549-.463-.823-1.097-.823-1.902 0-.805.3-1.464.9-1.976.6-.512 1.439-.768 2.512-.768h3.025c.402 0 .707-.066.914-.196.208-.13.312-.33.312-.597 0-.33-.146-.561-.439-.695-.293-.134-.732-.201-1.317-.201H9.854c-.952 0-1.732.274-2.342.823-.61.549-.915 1.317-.915 2.305 0 .61.164 1.147.494 1.61.33.463.762.774 1.299.933L7.534 16.775zm8.003-6.585c0-.279-.02-.529-.06-.75h1.478l-.237 1.31h.04c.308-.464.716-.835 1.223-1.114.508-.278.98-.417 1.416-.417.983 0 1.68.38 2.09.915.442.562.663 1.36.663 2.392V17H19.46v-4.952c0-.846-.236-1.423-.708-1.732-.471-.308-1.083-.462-1.834-.462-.508 0-.96.098-1.356.293-.396.195-.708.497-.936.903V17h-1.756v-6.81zm-9.817 0c0-.279-.02-.529-.06-.75h1.478l-.237 1.31h.04c.308-.464.716-.835 1.223-1.114.508-.278.98-.417 1.416-.417.983 0 1.68.38 2.09.915.442.562.663 1.36.663 2.392V17H4.74v-4.952c0-.846-.237-1.423-.709-1.732-.471-.308-1.083-.462-1.834-.462-.508 0-.96.098-1.356.293-.396.195-.708.497-.936.903V17H0v-6.81z" />
              </svg>
              <h3 className="text-xl font-semibold text-primary mb-2">PayPal</h3>
              <p className="text-muted-foreground">A secure global payment option, especially for international students (may include processing fees).</p>
            </Card>
          </div>
        </div>
      </section>

      {/* "Need Help Choosing?" CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Confused About Pricing or Plans?</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re here to help! Book a free demo session, and we&apos;ll discuss your needs and guide you to the best TEF Canada preparation plan.
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/book-demo">Book Your Free Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/ai-course-suggester">Try AI Course Suggester</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
