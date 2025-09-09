// src/app/(public)/testimonials/page.tsx
"use client";

import { useState } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Mock data for testimonials
const allTestimonials = [
    { name: "Priya Sharma", role: "Software Engineer", location: "Toronto, ON", rating: 5, photo: "https://placehold.co/100x100.png", content: "FRANCOBUDDY was a game-changer! I scored 371/400 in my TEF exam, which was crucial for my PR application. The instructors are simply the best.", aiHint: "professional woman" },
    { name: "Rahul Patel", role: "Business Analyst", location: "Mississauga, ON", rating: 5, photo: "https://placehold.co/100x100.png", content: "I went from zero French (A0) to a confident B2 level, which helped me secure a promotion and an $18k salary increase. The personalized approach made all the difference.", aiHint: "professional man" },
    { name: "Kavya Reddy", role: "University Student", location: "Brampton, ON", rating: 4.8, photo: "https://placehold.co/100x100.png", content: "As a university student, I needed to pass my DELF B2 exam. FRANCOBUDDY's flexible schedule and supportive community were perfect for me. I passed with flying colors!", aiHint: "female student" },
    { name: "Sandeep Singh", role: "IT Consultant", location: "Vancouver, BC", rating: 4.9, photo: "https://placehold.co/100x100.png", content: "The TEF Canada prep course is intense but incredibly effective. The mock tests and feedback sessions were invaluable.", aiHint: "male tech professional" },
    { name: "Anjali Mehta", role: "Pharmacist", location: "Calgary, AB", rating: 5, photo: "https://placehold.co/100x100.png", content: "Thanks to FRANCOBUDDY, I achieved the French proficiency needed for my provincial nomination. Highly recommended!", aiHint: "female healthcare professional" },
    { name: "Vikram Kumar", role: "Mechanical Engineer", location: "Toronto, ON", rating: 4.7, photo: "https://placehold.co/100x100.png", content: "The small class sizes are a huge advantage. You get so much more speaking time and personal attention than in other schools.", aiHint: "male engineer" },
    { name: "Neha Gupta", role: "Marketing Manager", location: "Scarborough, ON", rating: 5, photo: "https://placehold.co/100x100.png", content: "Excellent teachers and a very structured curriculum. I feel so much more confident speaking French at work.", aiHint: "marketing professional woman" },
    { name: "Ravi Desai", role: "Accountant", location: "Brampton, ON", rating: 4.8, photo: "https://placehold.co/100x100.png", content: "A great investment in my career and my future in Canada.", aiHint: "male accountant" },
    { name: "Pooja Trivedi", role: "Data Scientist", location: "Toronto, ON", rating: 5, photo: "https://placehold.co/100x100.png", content: "The online classes are just as engaging as in-person. The tech setup is seamless.", aiHint: "data scientist woman" },
    { name: "Amit Kumar", role: "Student", location: "Etobicoke, ON", rating: 4.6, photo: "https://placehold.co/100x100.png", content: "Learning a lot!", aiHint: "male student" },
    { name: "Sunita Devi", role: "Homemaker", location: "Mississauga, ON", rating: 5, photo: "https://placehold.co/100x100.png", content: "Very patient and caring instructors. I finally feel comfortable speaking French.", aiHint: "woman portrait" },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof allTestimonials[0] }) => (
    <Card className="p-6 shadow-lg h-full flex flex-col">
         <div className="flex items-center mb-4">
            <Avatar className="h-14 w-14 mr-4">
                <AvatarImage src={testimonial.photo} alt={testimonial.name} data-ai-hint={testimonial.aiHint} />
                <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
                <h4 className="font-semibold text-secondary">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.location}</p>
            </div>
        </div>
        <CardContent className="flex-grow p-0">
            <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
        </CardContent>
        <div className="flex items-center mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
            <span className="ml-2 text-sm font-bold text-foreground">{testimonial.rating}/5</span>
        </div>
    </Card>
);

export default function TestimonialsPage() {
    const [visibleCount, setVisibleCount] = useState(9);

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 9);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="bg-secondary text-secondary-foreground py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Real Students, Real Results, Real Transformation</h1>
                    <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
                        See what our students have to say about their journey to French fluency with FRANCOBUDDY.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-secondary-foreground/90">
                        <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> 500+ Happy Students</span>
                        <span className="flex items-center gap-2"><Award className="h-5 w-5 text-primary"/> 96% Success Rate</span>
                        <span className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> 4.9/5 Average Rating</span>
                        <span className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> 3-6 Months to Fluency</span>
                    </div>
                </div>
            </section>

            {/* Featured Testimonials */}
            <section className="py-16 md:py-24">
                 <div className="container mx-auto px-4">
                    <SectionTitle title="Featured Stories" />
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        {allTestimonials.slice(0, 3).map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                 </div>
            </section>
            
            {/* All Testimonials Grid */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <SectionTitle title="What Our Students Say" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allTestimonials.slice(3, visibleCount).map((testimonial, index) => (
                           <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                    {visibleCount < allTestimonials.length && (
                        <div className="text-center mt-12">
                            <Button onClick={loadMore} size="lg">Load More Testimonials</Button>
                        </div>
                    )}
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-20 bg-background">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                  Ready to Start Your French Learning Journey?
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Link href="/book-demo">Book FREE Demo Class</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                   <Button asChild size="lg" variant="default">
                    <Link href="/enrollment-form">Enroll Now</Link>
                  </Button>
                </div>
              </div>
            </section>
        </>
    );
}
