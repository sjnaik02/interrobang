"use client";

import { NavLink } from "@/app/_components/NavLink";
import { Separator } from "@/components/ui/separator";
import { Home, Pen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { CreateSurveyButton } from "./CreateSurveyButton";
import type { CreateSurveyType } from "@/app/actions/survey";

export const DashboardSidebar = ({
  createSurvey,
}: {
  createSurvey: CreateSurveyType;
}) => {
  return (
    <aside className="flex h-full w-64 bg-muted">
      <div className="flex h-full w-full flex-col gap-4 p-4">
        <p className="text-center text-2xl">Interrobang ‽</p>
        <nav className="mt-4 flex flex-col items-center gap-2 font-mono">
          <NavLink href="/dashboard">
            <Home className="h-4 w-4" />
            Home
          </NavLink>
          <NavLink href="/dashboard/surveys">
            <Pen className="h-4 w-4" />
            Surveys
          </NavLink>
          {/* <NavLink href="/dashboard/visualise">
            <BarChart className="h-4 w-4" />
            Visualise
          </NavLink> */}
        </nav>
        <CreateSurveyButton createSurvey={createSurvey} />
        <Separator />
        <div className="mt-auto flex items-center">
          <UserButton />
        </div>
      </div>
      <Separator orientation="vertical" className="h-full self-center" />
    </aside>
  );
};
