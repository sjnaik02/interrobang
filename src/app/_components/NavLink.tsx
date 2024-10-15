"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export const NavLink = ({ href, className, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-2 rounded-2xl px-4 py-2 hover:bg-gray-200",
        isActive
          ? "text-foreground bg-gray-200 font-semibold"
          : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
};
