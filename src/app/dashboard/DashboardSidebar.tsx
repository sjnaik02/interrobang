import { NavLink } from "@/app/_components/NavLink";
import { Separator } from "@/components/ui/separator";
import { BarChart, Home, Pen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { CreateSurveyButton } from "./CreateSurveyButton";
import type { CreateSurveyType } from "@/app/actions/survey";

export const DashboardSidebar = async ({
  createSurvey,
}: {
  createSurvey: CreateSurveyType;
}) => {
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
        <CreateSurveyButton createSurvey={createSurvey} />
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
