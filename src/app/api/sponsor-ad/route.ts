import { NextResponse } from "next/server";
import "server-only";
import { getSponsorAdBySurveyId } from "@/server/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surveyId = searchParams.get("surveyId");
  if (!surveyId) {
    return NextResponse.json({ error: "Missing surveyId" }, { status: 400 });
  }
  const ad = await getSponsorAdBySurveyId(surveyId);
  return NextResponse.json(ad);
}
