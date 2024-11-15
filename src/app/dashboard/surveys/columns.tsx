/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Survey } from "@/server/db/schema";
import SurveyActionsDropdown from "../SurveyActionsDropdown";
import { Badge } from "@/components/ui/badge";
import {
  archiveSurvey,
  renameSurvey,
  deleteSurvey,
} from "@/app/actions/survey";

export const columns: ColumnDef<Survey>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const isArchived = row.original.isArchived;
      const isPublished = row.original.isPublished;
      const status = isArchived
        ? "archived"
        : isPublished
          ? "published"
          : "draft";

      return <SurveyStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString("en-US");
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date | null;
      return date ? date.toLocaleDateString("en-US") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <SurveyActionsDropdown
        id={row.original.id}
        isArchived={row.original.isArchived ?? false}
        surveyName={row.original.name}
        archiveSurvey={archiveSurvey}
        deleteSurvey={deleteSurvey}
        renameSurvey={renameSurvey}
      />
    ),
  },
];

const SurveyStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "archived":
      return <Badge variant="destructive">Archived</Badge>;
    case "published":
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Published
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
          Draft
        </Badge>
      );
  }
};
