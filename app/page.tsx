import { AnimatedTestimonial } from "@/components/LandingPage/AnimatedTestimonials";
import { InfiniteMovingCardsDemo } from "@/components/LandingPage/Companies";
import { LayoutGridDemo } from "@/components/LandingPage/GallerySec";
import { HeroHighlightDemo } from "@/components/LandingPage/HeroSec";
import { WorldMapDemo } from "@/components/LandingPage/WorldMap";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <HeroHighlightDemo />
      <InfiniteMovingCardsDemo />
      <WorldMapDemo />
      <AnimatedTestimonial />
      <LayoutGridDemo />
    </div>
  );
}
