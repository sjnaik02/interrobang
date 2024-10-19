"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSurvey } from "@/server/queries";
import { useState } from "react";

export const CreateFormButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleCreateForm = async () => {
    setLoading(true);
    const newSurvey = await createSurvey();
    router.push(`/survey/create/${newSurvey?.id}`);
  };

  return (
    <>
      <Button
        className="flex items-center rounded-2xl px-4 py-2 text-sm"
        onClick={handleCreateForm}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Survey
      </Button>
      {loading && (
        <div className="absolute flex h-full w-full items-center justify-center bg-white">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </>
  );
};
