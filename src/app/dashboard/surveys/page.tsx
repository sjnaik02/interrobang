/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { getSurveys } from "@/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const SurveysPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const surveys = await getSurveys(skip, pageSize);

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Surveys</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */}
      <DataTable columns={columns as any} data={surveys} />
    </div>
  );
};

export default SurveysPage;
