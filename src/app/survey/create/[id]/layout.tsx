import { SurveyBuilderContextProvider } from "@/components/context/surveyBuilderContext";
export default function CreateFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SurveyBuilderContextProvider>{children}</SurveyBuilderContextProvider>
  );
}
