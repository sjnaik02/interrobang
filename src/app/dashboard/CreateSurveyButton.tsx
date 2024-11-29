"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SurveyElementInstance } from "@/components/SurveyElement";

export const CreateSurveyButton = ({
  createSurvey,
}: {
  createSurvey: () => Promise<
    | {
        id: string;
        name: string;
        title: string;
        questions: SurveyElementInstance[] | null;
        isPublished: boolean | null;
        isArchived: boolean | null;
        createdBy: string | null;
        responseCount: number | null;
        createdAt: Date;
        updatedAt: Date | null;
      }
    | undefined
  >;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleCreateSurvey = async () => {
    setLoading(true);
    const newSurvey = await createSurvey();
    router.push(`/survey/create/${newSurvey?.id}`);
  };

  return (
    <>
      <Button
        onClick={handleCreateSurvey}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        <PlusCircle className="h-4 w-4" />
        Create Survey
      </Button>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </>
  );
};
