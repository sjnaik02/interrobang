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
  duplicateSurvey,
} from "@/app/actions/survey";

export const columns: ColumnDef<Survey>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <Link
          href={`/survey/create/${row.original.id}`}
          className="flex items-center gap-2 underline"
        >
          {row.original.title} <ExternalLink className="h-4 w-4" />
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString("en-US");
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
      return row.original.isPublished ? (
        <Button
          variant="ghost"
          size="icon"
          asChild
          disabled={!row.original.isPublished}
        >
          <Link href={`/survey/responses/${row.original.id}`}>
            <MessageSquareQuote className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="inline-flex items-center gap-2 text-muted-foreground"
        >
          <MessageSquareQuote className="h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "visualize",
    header: "Visualize",
    cell: ({ row }) => {
      return row.original.isPublished ? (
        <Button
          variant="ghost"
          size="icon"
          asChild
          disabled={!row.original.isPublished}
        >
          <Link href={`/survey/visualize/${row.original.id}`}>
            <BarChart className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          disabled
          className="inline-flex items-center gap-2 text-muted-foreground"
        >
          <BarChart className="h-4 w-4" />
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
        surveyName={row.original.title}
        archiveSurvey={archiveSurvey}
        deleteSurvey={deleteSurvey}
        renameSurvey={renameSurvey}
        duplicateSurvey={duplicateSurvey}
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
