"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  icon?: React.ReactNode;
  text: string;
};

export const NavLink = ({ href, icon, text }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-2 rounded-2xl px-4 py-2 hover:bg-gray-200 ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}
    >
      {icon}
      {text}
    </Link>
  );
};
