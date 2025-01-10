import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { testimonials } from "@/data/testimonials";

export function AnimatedTestimonial() {
  return (
    <>
      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
        Their Journey, Their Words
      </span>
      <AnimatedTestimonials testimonials={testimonials} />
    </>
  );
}
