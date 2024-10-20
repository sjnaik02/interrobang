import { currentUser } from "@clerk/nextjs/server";
import { getAllSurveys } from "@/server/queries";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  const surveys = await getAllSurveys();
  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <header className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-orange-500" />
          <p className="font-mono text-lg font-light uppercase tracking-tight">
            Welcome back, <span className="">{user?.firstName}</span>
          </p>
        </header>
        <div className="flex flex-col items-center gap-2">
          {surveys.map((survey) => (
            <Link
              key={survey.id}
              href={`/survey/create/${survey.id}`}
              className="flex items-center gap-2 hover:underline"
            >
              <p>{survey.name}</p>
              <p>{survey.id}</p>
              <ExternalLink className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
