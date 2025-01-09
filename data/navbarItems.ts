export interface NavbarItem {
  id: string;
  title: string;
  route?: string;
  dropdownItems?: {
    title: string;
    href: string;
    description: string;
  };
}

export const loginSignup = [
  {
    text: "Login",
    href: "/login",
    variant: "ghost",
  },
  {
    text: "Get Started",
    href: "/signup",
  },
];

export const navbarItems: NavbarItem[] = [
  {
    id: "home",
    title: "Home",
    route: "/",
  },
  {
    id: "features",
    title: "Features",
    dropdownItems: [
      {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
          "A modal dialog that interrupts the user with important content and expects a response.",
      },
      {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
          "For sighted users to preview content available behind a link.",
      },
      {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
          "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
      },
      {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
      },
      {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
          "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
      },
      {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
          "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      },
    ],
  },
  {
    id: "faqs",
    title: "FAQs",
    route: "#faqs",
  },
  {
    id: "pages",
    title: "Pages",
    dropdownItems: [
      {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
          "A modal dialog that interrupts the user with important content and expects a response.",
      },
      {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
          "For sighted users to preview content available behind a link.",
      },
      {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
          "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
      },
      {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
      },
      {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
          "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
      },
      {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
          "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      },
    ],
  },
];
