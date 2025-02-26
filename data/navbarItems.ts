export interface NavbarItem {
  id: string;
  title: string;
  route?: string;
  description?: string;
  showImage?: boolean;
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
    id: "interact",
    title: "Interact",
    description:
      "Connect with alumni & college through various channels and opportunities",
    showImage: true,
    dropdownItems: [
      {
        title: "Events",
        href: "/events",
        description:
          "View and register for upcoming events and view past events.",
      },
      {
        title: "Referrals",
        href: "/referrals",
        description:
          "View and manage your referrals and view referral statistics.",
      },
      {
        title: "Jobs",
        href: "/jobs",
        description:
          "View and apply for job openings and view past job applications.",
      },
    ],
  },
  {
    id: "other pages",
    title: "Other Pages",
    dropdownItems: [
      {
        title: "Contact Us",
        href: "/contactus",
        description:
          "Contact us for any queries or feedback. We're here to help!",
      },
      {
        title: "FAQs",
        href: "/faqs",
        description:
          "Frequently Asked Questions about the Platform and its features.",
      },
    ],
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
