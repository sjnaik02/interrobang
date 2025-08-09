/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { type Survey, type SponsorAd } from "@/server/db/schema";
import { type SurveyElementInstance, SurveyElements } from "./SurveyElement";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Home, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { SponsorCopyRenderer } from "./editor/SponsorCopyRenderer";
// import type { Value } from "@udecode/plate/react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any[];

const SurveySubmitPage = ({
  survey,
  submitSurvey,
  sponsorAd,
}: {
  survey: Survey;
  submitSurvey: (
    id: string,
    answers: Record<string, string>,
  ) => Promise<boolean>;
  sponsorAd: SponsorAd | null;
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
    return <ThankYouPage survey={survey} sponsorAd={sponsorAd} />;
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
      <div className="mb-12 grow">
        <h1 className="mt-12 mb-8 text-3xl font-semibold">{survey.title}</h1>
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
                  }) as React.ReactElement<any>
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
    <footer className="text-muted-foreground flex items-center justify-center border-t px-4 pt-4 text-sm">
      Powered by Interrobang
      <span className="mx-2">•</span>
      <Link href="/" className="flex items-center gap-1 underline">
        <Home className="h-4 w-4" /> Go to homepage
      </Link>
    </footer>
  );
};

export const ThankYouPage = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  survey,
  sponsorAd,
}: {
  survey: Survey;
  sponsorAd: SponsorAd | null;
}) => {
  // log impression once
  const impressionLogged = useRef(false);
  useEffect(() => {
    if (sponsorAd && !impressionLogged.current) {
      impressionLogged.current = true;
      void fetch("/api/sponsor-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorAdId: sponsorAd.id,
          eventType: "impression",
        }),
      });
    }
  }, [sponsorAd]);

  const handleCTA = async () => {
    if (!sponsorAd) return;
    try {
      await fetch("/api/sponsor-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsorAdId: sponsorAd.id, eventType: "click" }),
      });
    } catch {}
    window.location.href = sponsorAd.ctaUrl;
  };

  return (
    <>
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg grow flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-lg">Thank you for your response!</h1>
        {sponsorAd && (
          <div className="mx-auto mb-10 flex w-full max-w-lg flex-col items-start space-y-4 rounded-lg border p-6 shadow-md">
            <p className="text-left text-xl">
              This survey was brought to you by{" "}
              <strong>{sponsorAd.sponsorName}</strong>
            </p>
            <SponsorCopyRenderer 
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value={sponsorAd.copy as Value} 
              className="text-left text-lg"
            />
            <Button onClick={handleCTA} className="w-full self-start">
              {sponsorAd.ctaText}
            </Button>
            <p className="text-muted-foreground mt-2 text-left text-xs">
              Thank you to <strong>{sponsorAd.sponsorName}</strong> for
              supporting Tangle&apos;s mission.
            </p>
          </div>
        )}
      </main>
      <SurveyFooter />
    </>
  );
};
