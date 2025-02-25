export interface NavbarItem {
  id: string;
  title: string;
  route?: string;
  dropdownItems?: Array<{
    title: string;
    href: string;
    description: string;
  }>;
}

interface LoginSignupItem {
  href: string;
  text: string;
  variant: "default" | "outline" | "ghost";
}

export const loginSignup: LoginSignupItem[] = [
  {
    href: "/login",
    text: "Login",
    variant: "outline",
  },
  {
    href: "/signup",
    text: "Sign Up",
    variant: "default",
  },
];

export const navbarItems: NavbarItem[] = [
  {
    id: "home",
    title: "Home",
    route: "/",
  },
  {
    id: "verification",
    title: "Alumni Verification",
    route: "/alumnidetails",
  },
  {
    id: "faqs",
    title: "FAQs",
    route: "#faqs",
  },
  {
    id: "pages",
    title: "Referrals",
    route: "/referrals"
  },
];
