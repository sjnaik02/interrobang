"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
};

export const NavLink = ({
  href,
  className,
  children,
  icon,
  selectedIcon,
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
        "hover:bg-muted/80",
        isActive
          ? "bg-primary/10 font-medium text-primary hover:bg-primary/20"
          : "text-muted-foreground",
        className,
      )}
    >
      {icon && isActive && selectedIcon ? selectedIcon : icon}
      {children}
    </Link>
  );
};
