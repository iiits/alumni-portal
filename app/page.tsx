import {HeroHighlightDemo} from "../components/LandingPage/HeroSec";
import {WorldMapDemo} from "../components/LandingPage/WorldMap";
import {LayoutGridDemo} from "../components/LandingPage/GallerySec";
import {SignupFormDemo} from "../components/LandingPage/Signup"
import { AnimatedTestimonial } from "@/components/LandingPage/AnimatedTestimonials";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
    <HeroHighlightDemo />
    <WorldMapDemo />
    <AnimatedTestimonial />
    <LayoutGridDemo />
    <SignupFormDemo/>
  </div>);
}
