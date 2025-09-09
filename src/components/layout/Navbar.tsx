// src/components/layout/Navbar.tsx
"use client";

import * as React from "react"
import Link from 'next/link';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

const aboutComponents: { title: string; href: string; description: string }[] = [
  {
    title: "About Us",
    href: "/about",
    description:
      "Learn about our mission, vision, and the team dedicated to your success.",
  },
  {
    title: "Testimonials",
    href: "/testimonials",
    description:
      "Read success stories from students who achieved their goals with us.",
  },
  {
    title: "FAQ",
    href: "/faq",
    description:
      "Find answers to common questions about our courses, TEF, and enrollment.",
  },
]

const coursesComponents: { title: string; href: string; description: string }[] = [
    {
        title: "All Courses",
        href: "/courses",
        description: "Explore our full range of TEF Canada preparation courses for all levels."
    },
    {
        title: "Pricing",
        href: "/pricing",
        description: "View our transparent and flexible pricing for group and 1-on-1 classes."
    },
    {
        title: "AI Course Suggester",
        href: "/ai-course-suggester",
        description: "Let our AI assistant recommend the perfect course for your profile and goals."
    },
     {
        title: "Enroll Now",
        href: "/enrollment-form",
        description: "Ready to start? Complete your enrollment and secure your spot today."
    },
]

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-secondary" />
          <span className="font-bold text-xl text-secondary hidden sm:inline-block">FRANCOBUDDY</span>
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
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {aboutComponents.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                                {component.description}
                            </ListItem>
                        ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                    <NavigationMenuContent>
                         <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {coursesComponents.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                                {component.description}
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

            </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
           <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
            <Link href="/enrollment-form">Enroll Now</Link>
          </Button>
          <Button asChild variant="default" size="sm" className="animate-pulse">
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
              <div className="flex flex-col p-6 gap-6">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Logo className="h-8 w-8 text-secondary" />
                  <span className="font-bold text-lg">FRANCOBUDDY</span>
                </Link>
                <Link href="/" className="text-lg">Home</Link>
                <Link href="/about" className="text-lg">About</Link>
                <Link href="/courses" className="text-lg">Courses</Link>
                <Link href="/pricing" className="text-lg">Pricing</Link>
                <Link href="/testimonials" className="text-lg">Testimonials</Link>
                <Link href="/blog" className="text-lg">Blog</Link>
                <Link href="/contact" className="text-lg">Contact Us</Link>
                <Button asChild variant="default" className="mt-4">
                  <Link href="/book-demo">Book Free Demo</Link>
                </Button>
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
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
