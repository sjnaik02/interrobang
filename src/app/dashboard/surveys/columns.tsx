/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Survey } from "@/server/db/schema";
import SurveyActionsDropdown from "../SurveyActionsDropdown";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquareQuote, BarChart } from "lucide-react";
import Link from "next/link";
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
    cell: ({ row }) => {
      return (
        <Link
          href={`/survey/create/${row.original.id}`}
          className="flex items-center gap-2 underline"
        >
          {row.original.name} <ExternalLink className="h-4 w-4" />
        </Link>
      );
    },
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
    accessorKey: "responseCount",
    header: "# of responses",
    cell: ({ row }) => {
      return (
        <span className="text-right tabular-nums">
          {row.original.responseCount}
        </span>
      );
    },
  },
  {
    id: "responses",
    header: "Responses",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/survey/responses/${row.original.id}`}>
            <MessageSquareQuote className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
  },

  {
    id: "visualize",
    header: "Visualize",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/survey/visualize/${row.original.id}`}>
            <BarChart className="h-4 w-4" />
          </Link>
        </Button>
      );
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
      return (
        <Badge className="bg-red-500 text-black hover:bg-red-600 hover:text-black">
          Archived
        </Badge>
      );
    case "published":
      return (
        <Badge className="bg-green-500 text-black hover:bg-green-600 hover:text-black">
          Published
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black">
          Draft
        </Badge>
      );
  }
};
