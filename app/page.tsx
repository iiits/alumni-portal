import {HeroHighlightDemo} from "../components/LandingPage/HeroSec";
import {WorldMapDemo} from "../components/LandingPage/WorldMap";
import {LayoutGridDemo} from "../components/LandingPage/GallerySec";
import {SignupFormDemo} from "../components/LandingPage/Signup"
export default function Home() {
  return <div className="flex-row items-center justify-center">
    <HeroHighlightDemo />
    <WorldMapDemo />
    <LayoutGridDemo />
    <SignupFormDemo/>
  </div>;
}
