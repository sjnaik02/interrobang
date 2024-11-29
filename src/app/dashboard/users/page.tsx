"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Users</h1>
      <Alert className="border-yellow-500 bg-yellow-50 text-yellow-900">
        <Building className="h-4 w-4" />
        <AlertTitle>Under construction</AlertTitle>
        <AlertDescription>
          User management is under development.
        </AlertDescription>
      </Alert>
    </div>
  );
}
