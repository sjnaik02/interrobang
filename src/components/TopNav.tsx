"use client";

import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BarChart2, LayoutDashboard, List, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TopNav = ({
  surveyName,
  isPublished,
  surveyId,
}: {
  surveyName: string;
  isPublished: boolean;
  surveyId: string;
}) => {
  const pathname = usePathname();
  return (
    <div className="container mx-auto flex w-full items-center border-b border-gray-200 py-2 font-mono">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <p>{surveyName}</p>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Badge
          className={`ml-2 ${isPublished ? "bg-green-400 hover:bg-green-400" : "bg-yellow-400 hover:bg-yellow-400"} text-black`}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
        <Separator orientation="vertical" className="my-2 h-6" />
      </div>
      <nav className="flex items-center gap-4">
        <Link
          href={`/survey/create/${surveyId}`}
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted",
            pathname === `/survey/create/${surveyId}` &&
              "text-foreground underline underline-offset-4",
          )}
        >
          <Plus className="mr-1 h-4 w-4" />
          Create
        </Link>
        <Link
          href={`/survey/responses/${surveyId}`}
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted",
            pathname === `/survey/responses/${surveyId}` &&
              "text-foreground underline underline-offset-4",
          )}
        >
          <List className="mr-1 h-4 w-4" />
          Responses
        </Link>
        <Link
          href={`/survey/visualize/${surveyId}`}
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted",
            pathname === `/survey/visualize/${surveyId}` &&
              "text-foreground underline underline-offset-4",
          )}
        >
          <BarChart2 className="mr-1 h-4 w-4" />
          Visualize
        </Link>
      </nav>
    </div>
  );
};

export default TopNav;
