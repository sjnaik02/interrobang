"use client";

import { NavLink } from "@/app/_components/NavLink";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Pen, Users } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { CreateSurveyButton } from "./CreateSurveyButton";
import type { CreateSurveyType } from "@/app/actions/survey";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const DashboardSidebar = ({
  createSurvey,
}: {
  createSurvey: CreateSurveyType;
}) => {
  const { isLoaded, user } = useUser();
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background shadow-sm">
      <div className="flex items-center justify-center border-b py-4">
        <h1 className="text-2xl">Interrobang ‽</h1>
      </div>
      <div className="flex h-full w-full flex-col gap-4 p-4">
        <nav className="flex flex-col gap-2 font-medium">
          <NavLink
            href="/dashboard"
            className="hover:bg-muted/80"
            icon={<LayoutDashboard className="h-4 w-4" />}
            selectedIcon={
              <LayoutDashboard className="h-4 w-4" fill="currentColor" />
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            href="/dashboard/surveys"
            className="hover:bg-muted/80"
            icon={<Pen className="h-4 w-4" />}
            selectedIcon={<Pen className="h-4 w-4" fill="currentColor" />}
          >
            Surveys
          </NavLink>
          <NavLink
            href="/dashboard/users"
            className="hover:bg-muted/80"
            icon={<Users className="h-4 w-4" />}
            selectedIcon={<Users className="h-4 w-4" fill="currentColor" />}
          >
            Users
          </NavLink>
        </nav>
        <CreateSurveyButton createSurvey={createSurvey} />
        <Separator className="opacity-50" />
        <Card className="mt-auto bg-muted/50">
          <CardContent className="flex items-center gap-3 p-3">
            {isLoaded ? (
              <>
                <UserButton />
                {user?.fullName && (
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground/80">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};
