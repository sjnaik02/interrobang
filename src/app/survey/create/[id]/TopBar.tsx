"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SurveyElements } from "@/components/SurveyElement";
import randomId from "@/lib/randomId";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Save, Eye, Send, Plus } from "lucide-react";
import useSurveyBuilder from "@/components/hooks/useSurveyBuilder";

const TopBar = ({ name }: { name: string | undefined }) => {
  const { elements, addElement } = useSurveyBuilder();
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 py-2 font-mono">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <p>{name}</p>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Separator orientation="vertical" className="my-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-2 py-1 text-sm" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Element
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.values(SurveyElements).map((element) => (
              <DropdownMenuItem
                key={element.type}
                onClick={() =>
                  addElement(elements.length, element.construct(randomId()))
                }
                className="cursor-pointer font-mono"
              >
                {element.type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="px-2 py-1 text-sm" size="sm">
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" className="px-2 py-1 text-sm" size="sm">
          <Eye className="mr-1 h-4 w-4" />
          Preview
        </Button>
        <Button
          className="bg-gradient-to-r from-red-500 to-blue-500 px-2 py-1 text-sm hover:from-red-600 hover:to-blue-600"
          size="sm"
        >
          <Send className="mr-1 h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
