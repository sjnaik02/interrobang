/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextArea } from "./fields/TextArea";
import { MultipleChoice } from "./fields/MultipleChoice";
import { type LucideIcon } from "lucide-react";
import { type z } from "zod";
export type ElementType = "TextArea" | "MultipleChoice";

export type SubmitFunction = (key: string, value: string) => void;

export type SurveyElement = {
  type: ElementType;
  name: string;
  icon: LucideIcon;
  construct: (id: string) => SurveyElementInstance;
  previewComponent: React.FC<{
    elementInstance: SurveyElementInstance;
  }>;
  editorComponent: React.FC<{
    elementInstance: SurveyElementInstance;
  }>;
  surveyComponent: React.FC<{
    elementInstance: SurveyElementInstance;
    field: any;
    index: number;
  }>;
  getFormSchema: (element: SurveyElementInstance) => z.ZodType;
};

export type SurveyElementInstance = {
  id: string;
  type: ElementType;
  properties?: Record<string, any>;
};

type SurveyElementsType = {
  [key in ElementType]: SurveyElement;
};

export const SurveyElements: SurveyElementsType = {
  MultipleChoice: MultipleChoice,
  TextArea: TextArea,
};
