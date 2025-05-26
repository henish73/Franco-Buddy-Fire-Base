import LoginForm from './LoginForm';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-accent/10 to-primary/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Login to Your Account</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Access your student or admin dashboard.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex justify-center">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
