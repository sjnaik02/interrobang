import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { surveys } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import SurveyPreview from "@/components/SurveyPreview";

export default async function PreviewSurveyPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();

  // Redirect to login if not authenticated
  if (!userId) {
    redirect(
      "/api/auth/signin?callbackUrl=" +
        encodeURIComponent(`/survey/preview/${params.id}`),
    );
  }

  // Fetch the survey
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.id, params.id),
  });

  if (!survey) {
    redirect("/404");
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Survey Preview</h1>
        <div className="rounded-md bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
          Preview Mode
        </div>
      </div>
      <SurveyPreview survey={survey} />
    </div>
  );
}
