import { NavLink } from "@/app/_components/NavLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart, Home, Pen, PlusCircle } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interrobang | Dashboard",
  description: "Interrobang | Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <div className="flex h-full">
        <DashboardSidebar />
        {children}
      </div>
    </div>
  );
}

const DashboardSidebar = async () => {
  return (
    <aside className="flex h-full w-64">
      <div className="flex h-full w-full flex-col gap-4 p-4">
        <nav className="mt-4 flex flex-col items-center gap-2 font-mono">
          <NavLink href="/dashboard">
            <Home className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink href="/dashboard/surveys">
            <Pen className="h-4 w-4" />
            Surveys
          </NavLink>
          <NavLink href="/dashboard/visualise">
            <BarChart className="h-4 w-4" />
            Visualise
          </NavLink>
        </nav>
        <Button className="flex items-center rounded-2xl px-4 py-2 text-sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Poll
        </Button>
        <Separator />
        <div className="mt-auto flex items-center">
          <UserButton />
        </div>
      </div>
      <Separator
        orientation="vertical"
        className="h-[calc(100%-2rem)] self-center"
      />
    </aside>
  );
};
