"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ArchiveSurveyType } from "@/app/actions/survey";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SurveyActionsDropdown = ({
  id,
  archiveSurvey,
}: {
  id: string;
  archiveSurvey: ArchiveSurveyType;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => {
            await archiveSurvey(id);
            toast.success("Survey archived");
          }}
        >
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SurveyActionsDropdown;
