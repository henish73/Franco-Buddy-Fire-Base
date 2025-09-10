// src/components/layout/Navbar.tsx
"use client";

import * as React from "react"
import Link from 'next/link';
import { Menu, ChevronDown, LogIn, BookOpen, DollarSign, Lightbulb, Info, Smile, HelpCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/Logo';

const aboutComponents: { title: string; href: string; icon: React.ElementType }[] = [
  {
    title: "Our Story",
    href: "/about",
    icon: Info,
  },
  {
    title: "Success Stories",
    href: "/testimonials",
    icon: Smile,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: HelpCircle,
  },
];

const coursesComponents: { title: string; href: string; icon: React.ElementType }[] = [
    {
        title: "All Courses",
        href: "/courses",
        icon: BookOpen
    },
    {
        title: "Pricing Plans",
        href: "/pricing",
        icon: DollarSign
    },
    {
        title: "AI Course Suggester",
        href: "/ai-course-suggester",
        icon: Bot
    },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold text-xl hidden sm:inline-block">FRANCOBUDDY</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                    <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href="/about"
                              >
                                <Info className="h-6 w-6" />
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  FRANCOBUDDY
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Learn about our mission, vision, and the team dedicated to your success.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {aboutComponents.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.href}
                            >
                              <component.icon className="h-4 w-4 mr-2 inline-block" />
                            </ListItem>
                          ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Courses & Pricing</NavigationMenuTrigger>
                    <NavigationMenuContent>
                         <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                         {coursesComponents.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                               <component.icon className="h-4 w-4 mr-2 inline-block" />
                            </ListItem>
                        ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                 <NavigationMenuItem>
                    <Link href="/blog" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Blog
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/contact" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Contact Us
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-secondary text-secondary-foreground hover:bg-secondary/90")}>
                            <LogIn className="mr-2 h-4 w-4"/> Login
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden lg:inline-flex bg-gradient-to-br from-secondary to-red-700 text-secondary-foreground hover:brightness-110 transition-all rounded-full">
            <Link href="/book-demo">Book Free Demo</Link>
          </Button>
        
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col p-6 gap-4">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Logo className="h-8 w-8" />
                  <span className="font-bold text-lg">FRANCOBUDDY</span>
                </Link>
                
                <SheetClose asChild><Link href="/" className="text-lg py-2">Home</Link></SheetClose>
                <SheetClose asChild><Link href="/about" className="text-lg py-2">About Us</Link></SheetClose>
                <SheetClose asChild><Link href="/courses" className="text-lg py-2">Courses</Link></SheetClose>
                <SheetClose asChild><Link href="/pricing" className="text-lg py-2">Pricing</Link></SheetClose>
                <SheetClose asChild><Link href="/testimonials" className="text-lg py-2">Testimonials</Link></SheetClose>
                <SheetClose asChild><Link href="/blog" className="text-lg py-2">Blog</Link></SheetClose>
                <SheetClose asChild><Link href="/contact" className="text-lg py-2">Contact Us</Link></SheetClose>

                <div className="border-t pt-4 mt-4 space-y-4">
                    <SheetClose asChild>
                        <Link href="/login" className="text-lg flex items-center w-full">
                           <LogIn className="mr-2 h-5 w-5"/> Login
                        </Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button asChild variant="default" className="w-full">
                            <Link href="/book-demo">Book Free Demo</Link>
                        </Button>
                    </SheetClose>
                     <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/enrollment-form">Enroll Now</Link>
                        </Button>
                    </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none flex items-center">{children}{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
