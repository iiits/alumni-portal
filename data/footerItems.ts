interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface QuickLink {
  title: string;
  href: string;
}

interface ContactInfo {
  address: string[];
  phone: string;
  email: string;
}

interface FooterData {
  socialLinks: SocialLink[];
  quickLinks: QuickLink[];
  resources: QuickLink[];
  contact: ContactInfo;
}

export const footerItems: FooterData = {
  socialLinks: [
    {
      icon: "Globe",
      href: "https://www.iiits.ac.in",
      label: "Website",
    },
    {
      icon: "Twitter",
      href: "https://twitter.com/IIITSC",
      label: "Twitter",
    },
    {
      icon: "Linkedin",
      href: "https://www.linkedin.com/school/indian-institute-of-information-technology-sricity/",
      label: "LinkedIn",
    },
    {
      icon: "Facebook",
      href: "https://www.facebook.com/IIIT.SriCity/",
      label: "Facebook",
    },
    {
      icon: "Instagram",
      href: "https://www.instagram.com/iiitsricity/?hl=en",
      label: "Instagram",
    },
    {
      icon: "Youtube",
      href: "https://www.youtube.com/channel/UCfDNjbRE6KRLShDHTLBO_UQ",
      label: "YouTube",
    },
    {
      icon: "Github",
      href: "https://github.com/iiits/alumni-portal",
      label: "GitHub",
    },
  ],
  quickLinks: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Services",
      href: "/services",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  resources: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Tutorials",
      href: "/tutorials",
    },
    {
      title: "Support",
      href: "/support",
    },
    {
      title: "FAQs",
      href: "/faqs",
    },
  ],
  contact: {
    address: [
      "Indian Institute of Information Technology,",
      "Sri City, Chittoor District",
      "Andhra Pradesh - 517646",
    ],
    phone: "+91-7032851919",
    email: "alumni.office@iiits.in",
  },
};
