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
    href: "/auth/login",
    text: "Login",
    variant: "outline",
  },
  {
    href: "/auth/signup",
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
    route: "/referrals",
  },
];

export interface ProfileMenuItem {
  title: string;
  href: string;
  description: string;
}

export const profileMenuItems: ProfileMenuItem[] = [
  {
    title: "Profile",
    href: "/profile/me",
    description: "View and edit your profile information",
  },
  {
    title: "Logout",
    href: "/auth/logout",
    description: "Sign out from your account",
  },
];
