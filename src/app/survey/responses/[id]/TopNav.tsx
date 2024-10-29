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

import { LayoutDashboard } from "lucide-react";

const TopNav = ({
  surveyName,
  isPublished,
}: {
  surveyName: string;
  isPublished: boolean;
}) => {
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 py-2 font-mono">
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
    </div>
  );
};

export default TopNav;
