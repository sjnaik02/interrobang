import { getPendingInvitations } from "@/server/queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { type Invitation } from "@clerk/nextjs/server";

type InvitationRowProps = {
  invitation: Invitation;
};

function InvitationRow({ invitation }: InvitationRowProps) {
  return (
    <div
      key={invitation.id}
      className="flex items-center justify-between rounded-lg border p-4"
    >
      <div>
        <p className="font-medium">{invitation.emailAddress}</p>
        <p className="text-sm text-gray-500">
          Invited on {new Date(invitation.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="text-sm text-gray-500">
        Role: {invitation.publicMetadata?.role as string}
      </div>
    </div>
  );
}

type PendingInvitationsListProps = {
  invitations: {
    data?: Invitation[];
  };
};

function PendingInvitationsList({ invitations }: PendingInvitationsListProps) {
  return (
    <div className="grid gap-4">
      {invitations?.data
        ?.filter((invitation) => invitation.status === "pending")
        .map((invitation) => (
          <InvitationRow key={invitation.id} invitation={invitation} />
        ))}
      {invitations?.data?.length === 0 && (
        <p className="text-center text-gray-500">No pending invitations</p>
      )}
    </div>
  );
}

export default async function UsersPage() {
  const user = await currentUser();
  if (!user || user?.firstName?.trim() !== "Shourya") redirect("/dashboard");
  const invitations = await getPendingInvitations();

  return (
    <div className="container mx-auto min-h-screen w-full overflow-y-scroll p-6">
      <div className="flex flex-col gap-6">
        <Alert className="border-yellow-300 bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>This page is under construction</AlertDescription>
        </Alert>
        <h1 className="text-3xl font-bold">Pending Invitations</h1>
        <PendingInvitationsList invitations={invitations} />
      </div>
    </div>
  );
}
