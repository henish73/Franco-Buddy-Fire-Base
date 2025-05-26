import AISuggestionForm from './AISuggestionForm';
import { Lightbulb, Bot } from 'lucide-react';

export default function AICourseSuggesterPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 to-primary/10 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <Bot className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">AI-Powered Course Suggester</h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Not sure which TEF Canada course is right for you? Answer a few questions and let our intelligent assistant guide you to the perfect program.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 flex justify-center">
          <AISuggestionForm />
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-semibold text-primary mb-4">How Our AI Suggester Works</h2>
            <p className="text-foreground/80 mb-4">
              Our AI Course Suggester uses advanced algorithms to analyze your TEF Canada goals, current French proficiency, and learning background. 
              It considers factors that contribute to success in the TEF Canada exam and matches your profile with our specialized course offerings.
            </p>
            <p className="text-foreground/80">
              The more detailed information you provide, the more accurate and personalized your recommendation will be. This tool is designed to give you a strong starting point in your decision-making process. For a definitive plan, we always recommend booking a free demo class with our expert advisors.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
