import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, HelpCircle, ShieldCheck, Zap, Gem } from 'lucide-react';

const pricingTiers = [
  {
    title: "Flexible Learning",
    price: "179",
    originalPrice: "299",
    badge: "Most Popular",
    features: [
      "Access to all group classes",
      "Flexible scheduling",
      "Online learning platform",
      "Community support",
      "Email & Chat support",
    ],
    buttonText: "Get Started",
    buttonVariant: "default" as const,
  },
  {
    title: "Group Learning",
    price: "249",
    originalPrice: "399",
    badge: "Great Value",
    features: [
      "Fixed weekly group sessions",
      "Structured curriculum",
      "Peer learning environment",
      "All features of Flexible Learning",
      "Dedicated progress tracking",
    ],
    buttonText: "Choose Group Plan",
    buttonVariant: "outline" as const,
  },
  {
    title: "One-on-One Intensive",
    price: "399",
    originalPrice: "599",
    badge: "Premium",
    features: [
      "Personalized 1:1 coaching",
      "Customized study plan",
      "Intensive mock test sessions",
      "Direct instructor access",
      "Maximum & fastest results",
    ],
    buttonText: "Choose Intensive Plan",
     buttonVariant: "outline" as const,
  },
];

const aiTutorTiers = [
    {
        title: "AI Basic Access",
        price: "29",
        features: [
            "20 AI assessments/month",
            "Speaking & Writing feedback",
            "Access to all AI prompts"
        ],
    },
    {
        title: "AI Premium Access",
        price: "49",
        features: [
            "Unlimited AI assessments",
            "Speaking & Writing feedback",
            "Personalized AI suggestions",
            "Progress tracking dashboard"
        ],
    }
]

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-background text-foreground py-20 md:py-32 animate-background-pan">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transparent &amp; Flexible Pricing</h1>
          <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
            Invest in your future with our clear and competitive TEF Canada course fees. Find the perfect plan to match your goals and budget.
          </p>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionTitle title="Our Course Packages" subtitle="Choose a plan that works for you. All prices are monthly fees." />
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.title} className={`flex flex-col shadow-xl hover:scale-105 transition-transform duration-300 ${tier.badge === 'Most Popular' ? 'border-primary border-2' : ''}`}>
                <CardHeader className="text-center py-8">
                  {tier.badge && <Badge variant={tier.badge === 'Most Popular' ? 'default' : 'secondary'} className="absolute top-0 -translate-y-1/2">{tier.badge}</Badge>}
                  <CardTitle className="text-2xl text-primary">{tier.title}</CardTitle>
                  <CardDescription className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                    <span className="text-destructive line-through">${tier.originalPrice}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow py-8 px-6 space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-px shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto p-6">
                  <Button asChild size="lg" className="w-full" variant={tier.buttonVariant}>
                    <Link href="/enrollment-form">{tier.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tutor Standalone Pricing */}
       <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Standalone AI Language Tutor" subtitle="Practice anytime, anywhere. Get instant feedback on your speaking and writing." />
           <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
             {aiTutorTiers.map((tier) => (
                <Card key={tier.title} className="flex flex-col shadow-xl hover:shadow-primary/20 transition-all duration-300">
                    <CardHeader className="text-center">
                        <Gem className="h-10 w-10 mx-auto text-primary mb-2"/>
                        <CardTitle className="text-2xl text-primary">{tier.title}</CardTitle>
                        <p className="text-3xl font-bold text-foreground">${tier.price}<span className="text-base font-normal text-muted-foreground">/month</span></p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <ul className="space-y-2">
                            {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                                <span>{feature}</span>
                            </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full" variant="outline"><Link href="#">Subscribe (Coming Soon)</Link></Button>
                    </CardFooter>
                </Card>
             ))}
           </div>
        </div>
      </section>


      {/* "Need Help Choosing?" CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Confused About Plans?</h2>
            <p className="text-muted-foreground mb-8">
              We're here to help! Book a free demo session, and we'll discuss your needs and guide you to the best TEF Canada preparation plan.
            </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/book-demo">Book Your Free Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}