import type { Metadata } from "next";
import { DashboardSidebar } from "./DashboardSidebar";

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
