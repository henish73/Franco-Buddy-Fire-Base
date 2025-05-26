import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Mail className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            We&apos;re here to answer your questions and help you start your TEF Canada journey. Reach out to us today!
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Direct Contact Info */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Direct Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-accent mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Email Us</h4>
                      <a href="mailto:info@frenchgta.ca" className="text-muted-foreground hover:text-primary transition-colors">info@frenchgta.ca</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-accent mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Call Us</h4>
                      <a href="tel:+1YOURNUMBER" className="text-muted-foreground hover:text-primary transition-colors">+1 (XXX) XXX-XXXX</a> {/* Replace with actual number */}
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <WhatsappIcon className="h-6 w-6 text-accent mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">WhatsApp</h4>
                      <a href="https://wa.me/1YOURNUMBER" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Chat with us</a> {/* Replace with actual number */}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-accent mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Business Hours</h4>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
                      <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM (EST)</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Media Links (Placeholder) */}
              {/* <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-4">
                   Add social media icons/links here if available beyond WhatsApp e.g. Linkedin, Facebook
                   <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></a>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
