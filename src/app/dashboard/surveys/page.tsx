import { getSurveys } from "@/server/queries";
import { notFound, redirect } from "next/navigation";
import { getTotalSurveyCount } from "@/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const PAGE_SIZE = 10;

const SurveysPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  if (page < 1) {
    return notFound();
  }
  const totalSurveyCount = await getTotalSurveyCount();

  if (page > Math.ceil(totalSurveyCount / PAGE_SIZE)) {
    redirect(`/dashboard/surveys?page=1`);
  }

  const surveys = await getSurveys(skip, PAGE_SIZE);

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Surveys</h1>
      <DataTable
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        columns={columns as any}
        data={surveys}
        totalCount={totalSurveyCount}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default SurveysPage;
