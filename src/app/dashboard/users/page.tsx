/* eslint-disable @next/next/no-img-element */
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";

export default function UsersPage() {
  const { organization } = useOrganization();
  const { user } = useUser();

  if (user?.firstName?.toLowerCase().trim() !== "shourya") {
    return <div>You are not authorized to access this page</div>;
  }
  return (
    <div className="flex min-h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Users for {organization?.name}</h1>
      <Alert className="border-yellow-500 bg-yellow-50 text-yellow-900">
        <Building className="h-4 w-4" />
        <AlertTitle>Under construction</AlertTitle>
        <AlertDescription>
          User management is under development.
        </AlertDescription>
      </Alert>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg">Organization Users</h2>
        <div className="flex flex-col gap-2">
          {organization?.getMemberships().then((memberships) => {
            return memberships.data.map((membership) => (
              <div
                key={membership.id}
                className="flex w-full items-center gap-2"
              >
                {membership.publicUserData.hasImage ? (
                  <img
                    src={membership.publicUserData.imageUrl}
                    alt={
                      membership.publicUserData.firstName ?? "Profile picture"
                    }
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-pink-500" />
                )}
                <span>
                  {membership.publicUserData.firstName +
                    " " +
                    membership.publicUserData.lastName}
                </span>
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
}
