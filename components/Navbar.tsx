"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navbarItems } from "@/data/navbarItems";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function Navbar() {
  return (
    <div className="w-full border-b relative z-[100000000000000000]">
      <div className="container mx-auto flex h-16 items-center justify-between max-w-[90vw]">
        {/* Left - Brand */}
        <div className="text-xl font-bold">IIITS</div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex h-full flex-col">
                {/* Sheet Header */}
                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold">IIITS</h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="flex flex-col gap-4">
                    {navbarItems.map((item) =>
                      item.dropdownItems ? (
                        <div key={item.id} className="flex flex-col gap-2">
                          <div className="font-medium">{item.title}</div>
                          <div className="pl-4">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block py-2 text-sm text-muted-foreground hover:text-primary"
                              >
                                {dropdownItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={item.id}
                          href={item.route || "#"}
                          className="py-2 font-medium hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* Sheet Footer */}
                <div className="border-t pt-4">
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost">Login</Button>
                    <Button>Get Started</Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop - Navigation */}
        <NavigationMenu className="hidden max-w-2xl sm:block">
          <NavigationMenuList>
            {navbarItems.map((item) => (
              <NavigationMenuItem key={item.id}>
                {item.dropdownItems ? (
                  <>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.dropdownItems.map((dropdownItem) => (
                          <ListItem
                            key={dropdownItem.href}
                            title={dropdownItem.title}
                            href={dropdownItem.href}
                          >
                            {dropdownItem.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.route || "#"} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop - Auth Buttons */}
        <div className="hidden items-center gap-4 sm:flex">
          <Button variant="ghost">Login</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  );
}
