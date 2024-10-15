import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Pen, Home, BarChart, PlusCircle, Link } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/app/_components/NavLink";

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

const DashboardSidebar = () => {
  return (
    <aside className="flex h-full w-64">
      <div className="flex h-full w-full flex-col gap-4 p-4">
        <nav className="mt-4 flex flex-col items-center gap-4 font-mono">
          <NavLink
            href="/dashboard"
            icon={<Home className="h-4 w-4" />}
            text="Home"
          />
          <NavLink
            href="/dashboard/surveys"
            icon={<Pen className="h-4 w-4" />}
            text="Surveys"
          />
          <NavLink
            href="/dashboard/visualise"
            icon={<BarChart className="h-4 w-4" />}
            text="Visualise"
          />
        </nav>
        <Button className="flex items-center rounded-2xl px-4 py-2 text-sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Poll
        </Button>
        <Separator />
      </div>
      <Separator
        orientation="vertical"
        className="h-[calc(100%-2rem)] self-center"
      />
    </aside>
  );
};
