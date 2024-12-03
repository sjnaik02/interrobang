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
import { Home, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

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
  const [hasSubmitted, setHasSubmitted] = useState(false);
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

  useEffect(() => {
    const submittedSurveys = JSON.parse(
      localStorage.getItem("submittedSurveys") ?? "[]",
    ) as string[];

    if (submittedSurveys.includes(survey.id)) {
      setHasSubmitted(true);
    }
  }, [survey.id]);

  // If already submitted, show thank you
  if (hasSubmitted) {
    return <ThankYouPage survey={survey} />;
  }

  //unpublished, archived, or no questions
  if (survey.questions?.length === 0 || !survey.questions) {
    notFound();
    return null;
  }

  if (survey.isPublished === false) {
    notFound();
    return null;
  }

  if (survey.isArchived === true) {
    notFound();
    return null;
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const success = await submitSurvey(survey.id, data);
      if (success) {
        const submittedSurveys = JSON.parse(
          localStorage.getItem("submittedSurveys") ?? "[]",
        ) as string[];

        localStorage.setItem(
          "submittedSurveys",
          JSON.stringify([...submittedSurveys, survey.id]),
        );

        toast.success("Survey submitted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
      setHasSubmitted(true);
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen w-full max-w-3xl flex-col p-4">
      <div className="mb-12 flex-grow">
        <h1 className="mb-8 mt-12 text-3xl font-semibold">{survey.title}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {survey.questions.map((element, idx) => (
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
    <footer className="flex items-center justify-center border-t px-4 pt-4 text-sm text-muted-foreground">
      Powered by Interrobang
      <span className="mx-2">•</span>
      <Link href="/" className="flex items-center gap-1 underline">
        <Home className="h-4 w-4" /> Go to homepage
      </Link>
    </footer>
  );
};

const ThankYouPage = ({ survey }: { survey: Survey }) => {
  return (
    <>
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-grow flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-3xl font-semibold">Thank You!</h1>
        <p className="mb-8 text-muted-foreground">
          Your response to {survey.title} has been recorded.
        </p>
        <Link
          href="https://www.readtangle.com/"
          className="flex items-center gap-2 underline"
        >
          Go to Tangle
          <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </main>
      <SurveyFooter />
    </>
  );
};
