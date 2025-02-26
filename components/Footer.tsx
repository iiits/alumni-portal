import { footerItems } from "@/data/footerItems";
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconMap = {
  Globe,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
} as const;

export function Footer() {
  return (
    <footer className="bg-muted py-12 px-4 md:px-8 w-full flex-shrink-0">
      <div className="flex flex-col lg:flex-row justify-around items-start gap-8 lg:gap-16">
        {/* Brand Section */}
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Image src="/collegeLogo.png" alt="IIITS" width={96} height={96} />
            <div className="flex flex-col gap-2">
              <span className="text-xl lg:text-2xl font-semibold text-gray-800">
                IIITS Alumni Portal
              </span>
              <p className="text-sm md:text-base text-muted-foreground">
                Once a part of us, always a part of us.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {footerItems.socialLinks.map((link, _, array) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              const sameLabels = array.filter(
                (item) => item.label === link.label,
              );
              const labelIndex =
                sameLabels.length > 1 ? sameLabels.indexOf(link) + 1 : null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground relative"
                  prefetch={false}
                  aria-label={
                    labelIndex ? `${link.label} ${labelIndex}` : link.label
                  }
                >
                  {labelIndex && (
                    <span className="absolute -top-3 -right-1 text-xs">
                      {labelIndex}
                    </span>
                  )}
                  <Icon className="h-6 w-6 xl:h-7 xl:w-7" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Middle Section - Quick Links & Resources */}
        <div className="flex flex-col sm:flex-row w-full lg:w-1/2 gap-8 justify-start lg:justify-around">
          <div className="flex flex-col gap-2 w-full sm:w-1/3">
            <h4 className="text-xl font-medium">Quick Links</h4>
            {footerItems.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-1/3">
            <h4 className="text-xl font-medium">Resources</h4>
            {footerItems.resources.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid gap-4">
          <h4 className="text-xl font-medium">Contact</h4>
          <div className="grid gap-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <address className="not-italic text-muted-foreground">
                {footerItems.contact.address.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <a
                href={`tel:${footerItems.contact.phone}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {footerItems.contact.phone}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <a
                href={`mailto:${footerItems.contact.email}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {footerItems.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
