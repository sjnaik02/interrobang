"use client";
import { Survey } from "@/server/db/schema";
import { SurveyElementInstance, SurveyElements } from "./SurveyElement";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Home } from "lucide-react";

const SurveySubmitPage = ({ survey }: { survey: Survey }) => {
  const generateFormSchema = (elements: SurveyElementInstance[]) => {
    // Empty object to store our rules
    const formFields: Record<string, z.ZodType> = {};

    // For each question in our survey...
    elements.forEach((element: SurveyElementInstance) => {
      // Ask that question type how it should be validated
      formFields[element.id] =
        SurveyElements[
          element.type as keyof typeof SurveyElements
        ].getFormSchema(element);
    });

    // Return one big schema with all our rules!
    return z.object(formFields);
  };

  const formSchema = generateFormSchema(survey.questions || []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.info(
      <pre className="mt-2 h-fit w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    // You'll probably want to send this to your API eventually
    console.log("Survey response:", data);
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
                  SurveyElements[
                    element.type as keyof typeof SurveyElements
                  ].surveyComponent({
                    elementInstance: element,
                    field,
                    index: idx,
                  }) as React.ReactElement
                }
              />
            ))}
            <Button type="submit">Submit</Button>
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
