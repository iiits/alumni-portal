"use client";

import { useState } from "react";

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
import { loginSignup, navbarItems, profileMenuItems } from "@/data/navbarItems";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-base font-medium leading-none">{title}</div>
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
  const [isOpen, setIsOpen] = useState(false);

  const { user, token } = useUserStore();
  const isLoggedIn = !!token;

  return (
    <div className="w-full border-b relative flex-shrink-0">
      <div className="container mx-auto flex h-16 items-center justify-between max-w-[90vw]">
        {/* Left - Brand */}
        <Link href="/" className="text-xl font-bold">
          IIITS
        </Link>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className={cn(isOpen && "hidden")}>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex h-full flex-col">
                {/* Sheet Header */}
                <div className="border-b pb-4">
                  <Link href="/" className="text-lg font-semibold">
                    IIITS
                  </Link>
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
                      ),
                    )}
                  </div>
                </div>

                {/* Sheet Footer */}
                <div className="border-t pt-4">
                  <div className="flex gap-2 text-lg">
                    {isLoggedIn ? (
                      <>
                        {profileMenuItems.map((item) => (
                          <Button key={item.title} variant="outline" asChild>
                            <Link href={item.href}>{item.title}</Link>
                          </Button>
                        ))}
                      </>
                    ) : (
                      loginSignup.map((item) => (
                        <Link key={item.href} href={item.href} passHref>
                          <Button variant={item.variant}>{item.text}</Button>
                        </Link>
                      ))
                    )}
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
                      {item.showImage ? (
                        <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  {item.title}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  {item.description}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {item.dropdownItems?.map((dropdownItem) => (
                            <ListItem
                              key={dropdownItem.href}
                              title={dropdownItem.title}
                              href={dropdownItem.href}
                            >
                              {dropdownItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      ) : (
                        <ul
                          className={cn(
                            "grid gap-3 p-4",
                            "md:w-[500px]",
                            item.dropdownItems && item.dropdownItems.length >= 4
                              ? "md:grid-cols-2"
                              : "md:grid-cols-1",
                          )}
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <ListItem
                              key={dropdownItem.href}
                              title={dropdownItem.title}
                              href={dropdownItem.href}
                            >
                              {dropdownItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      )}
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
        <div className="hidden items-center gap-2 sm:flex">
          {isLoggedIn ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.profilePicture || ""} />
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4">
                      {profileMenuItems.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            loginSignup.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button variant={item.variant}>{item.text}</Button>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
