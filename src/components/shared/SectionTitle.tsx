import { cn } from "@/lib/utils";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function SectionTitle({ title, subtitle, className, titleClassName, subtitleClassName }: SectionTitleProps) {
  return (
    <div className={cn("mb-8 md:mb-12 text-center", className)}>
      <h2 className={cn("text-3xl md:text-4xl font-bold text-primary mb-2", titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
