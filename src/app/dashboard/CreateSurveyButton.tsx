"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSurvey } from "@/server/queries";

export const CreateFormButton = () => {
  const router = useRouter();
  const handleCreateForm = async () => {
    const newSurvey = await createSurvey();

    router.push(`/survey/create/${newSurvey?.id}`);
  };

  return (
    <Button
      className="flex items-center rounded-2xl px-4 py-2 text-sm"
      onClick={handleCreateForm}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Create Survey
    </Button>
  );
};
