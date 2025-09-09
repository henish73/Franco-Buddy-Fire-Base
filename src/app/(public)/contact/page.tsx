import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import ContactForm from './ContactForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-background to-background text-primary-foreground py-20 md:py-32 animate-background-pan">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Let's Talk About Your French Goals</h1>
          <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
            We're here to answer your questions and help you start your TEF Canada journey. Reach out to us today!
          </p>
           <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild variant="secondary" size="lg">
                <a href="tel:+13653062049">Call Now</a>
              </Button>
               <Button asChild variant="outline" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <a href="https://wa.me/13653062049" target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="mr-2" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="default" size="lg">
                <a href="mailto:frenchgta.ca@gmail.com">Email Us</a>
              </Button>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Direct Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Direct Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Location</h4>
                      <p className="text-muted-foreground">Toronto & GTA, Ontario, Canada</p>
                      <p className="text-xs text-muted-foreground">(Online & In-person classes available)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Phone</h4>
                      <a href="tel:+13653062049" className="text-muted-foreground hover:text-primary transition-colors">+1 (365) 306-2049</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <a href="mailto:frenchgta.ca@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">frenchgta.ca@gmail.com</a>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <WhatsappIcon className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">WhatsApp</h4>
                      <a href="https://wa.me/13653062049" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Chat with us</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Monday - Sunday: 7:00 AM - 10:00 PM (EST)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Funnel */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle title="Connect With Us on Social Media" subtitle="Follow us for learning tips, success stories, and special announcements."/>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <Card className="text-center p-6 shadow-lg">
              <Instagram className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-foreground mb-2">Instagram</h3>
              <p className="text-muted-foreground mb-4">Get daily tips, student spotlights, and behind-the-scenes content.</p>
              <Button asChild>
                <a href="https://instagram.com/francobuddy" target="_blank" rel="noopener noreferrer">Follow @francobuddy</a>
              </Button>
            </Card>
             <Card className="text-center p-6 shadow-lg">
              <Facebook className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-foreground mb-2">Facebook</h3>
              <p className="text-muted-foreground mb-4">Join our community, get updates, and connect with fellow learners.</p>
              <Button asChild>
                <a href="https://facebook.com/francobuddy" target="_blank" rel="noopener noreferrer">Like our Page</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
