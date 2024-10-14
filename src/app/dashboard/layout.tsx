import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

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
    <div className="p-4">
      <DashboardHeader />
      {children}
    </div>
  );
}

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <p className="">Welcome back, </p>
      <div className="flex items-center gap-2">
        <Button>Create Poll</Button>
      </div>
    </div>
  );
};
