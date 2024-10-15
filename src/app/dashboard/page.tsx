import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-orange-500" />
        <p className="font-mono text-lg font-light uppercase tracking-tight">
          Welcome back, <span className="">{user?.firstName}</span>
        </p>
      </div>
    </div>
  );
}
