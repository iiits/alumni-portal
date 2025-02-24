import {
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiReddit,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";
import { JSX } from "react";
import { SocialMediaProfile } from "./UserProfile";

export const socialIcons: Record<SocialMediaProfile["type"], JSX.Element> = {
  linkedin: <Linkedin className="w-6 h-6 text-blue-600 hover:text-blue-800" />,
  twitter: <SiX className="w-6 h-6 text-blue-400 hover:text-blue-600" />,
  github: <SiGithub className="w-6 h-6 text-gray-800 hover:text-gray-900" />,
  instagram: (
    <SiInstagram className="w-6 h-6 text-pink-500 hover:text-pink-700" />
  ),
  facebook: (
    <SiFacebook className="w-6 h-6 text-blue-700 hover:text-blue-900" />
  ),
  youtube: <SiYoutube className="w-6 h-6 text-red-600 hover:text-red-800" />,
  reddit: (
    <SiReddit className="w-6 h-6 text-orange-600 hover:text-orange-800" />
  ),
  discord: (
    <SiDiscord className="w-6 h-6 text-purple-600 hover:text-purple-800" />
  ),
};
