"use client";

import { type Survey } from "@/server/db/schema";
import { SurveyElements, type SurveyElementInstance } from "./SurveyElement";
import { Button } from "./ui/button";

interface SurveyPreviewProps {
  survey: Survey;
}

export default function SurveyPreview({ survey }: SurveyPreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-medium">{survey.title}</h1>
      {survey.questions?.map((element: SurveyElementInstance, idx: number) => {
        const PreviewComponent = SurveyElements[element.type].previewComponent;
        return (
          <div key={idx + element.type} className="flex w-full">
            <p className="mr-2 text-lg">{idx + 1}. </p>
            <PreviewComponent elementInstance={element} />
          </div>
        );
      })}
      <Button variant="default" className="mt-4 w-fit">
        Submit
      </Button>
    </div>
  );
}
