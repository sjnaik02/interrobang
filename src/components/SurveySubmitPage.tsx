"use client";
import { type Survey } from "@/server/db/schema";
import { type SurveyElementInstance, SurveyElements } from "./SurveyElement";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Home, Loader2 } from "lucide-react";
import { useState } from "react";

const SurveySubmitPage = ({
  survey,
  submitSurvey,
}: {
  survey: Survey;
  submitSurvey: (
    id: string,
    answers: Record<string, string>,
  ) => Promise<boolean>;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const generateFormSchema = (elements: SurveyElementInstance[]) => {
    const formFields: Record<string, z.ZodType> = {};

    elements.forEach((element: SurveyElementInstance) => {
      formFields[element.id] =
        SurveyElements[element.type].getFormSchema(element);
    });

    return z.object(formFields);
  };

  const formSchema = generateFormSchema(survey.questions ?? []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      await submitSurvey(survey.id, data);
      toast.success("Survey submitted successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to submit survey");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen w-full max-w-3xl flex-col p-4">
      <div className="flex-grow">
        <h1 className="mb-8 mt-24 text-3xl font-semibold">{survey.title}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {survey.questions?.map((element, idx) => (
              <FormField
                key={element.id}
                control={form.control}
                name={element.id}
                render={({ field }) =>
                  SurveyElements[element.type].surveyComponent({
                    elementInstance: element,
                    field,
                    index: idx,
                  }) as React.ReactElement
                }
              />
            ))}
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <SurveyFooter />
    </main>
  );
};

export default SurveySubmitPage;

const SurveyFooter: React.FC = () => {
  return (
    <footer className="flex items-center justify-center border-t pt-4 text-sm text-muted-foreground">
      Powered by Interrobang
      <span className="mx-2">•</span>
      <Link href="/" className="flex items-center gap-1 underline">
        <Home className="h-4 w-4" /> Go to homepage
      </Link>
    </footer>
  );
};
