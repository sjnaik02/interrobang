/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Trash2,
  UserPlus,
  XCircle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createInvitation,
  revokeInvitation,
  removeUser,
} from "@/app/actions/invitations";
import { getUsersData, type UsersData } from "./users-data";

type InvitationRowProps = {
  invitation: {
    id: string;
    emailAddress: string;
    createdAt: string;
    status: string;
  };
  onRevoke: (id: string) => Promise<void>;
};

function InvitationRow({ invitation, onRevoke }: InvitationRowProps) {
  const [isRevoking, setIsRevoking] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">{invitation.emailAddress}</p>
        <p className="text-sm text-gray-500">
          Invited on {new Date(invitation.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          setIsRevoking(true);
          try {
            await onRevoke(invitation.id);
            toast.success("Invitation revoked");
          } catch (error) {
            toast.error("Failed to revoke invitation");
          }
          setIsRevoking(false);
        }}
        disabled={isRevoking}
      >
        {isRevoking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <span className="ml-2">Revoke</span>
      </Button>
    </div>
  );
}

type PendingInvitationsListProps = {
  invitations: {
    data: Array<{
      id: string;
      emailAddress: string;
      createdAt: string;
      status: string;
    }>;
  };
  onRevoke: (id: string) => Promise<void>;
};

function PendingInvitationsList({
  invitations,
  onRevoke,
}: PendingInvitationsListProps) {
  return (
    <div className="grid gap-4">
      {invitations.data.map((invitation) => (
        <InvitationRow
          key={invitation.id}
          invitation={invitation}
          onRevoke={onRevoke}
        />
      ))}
      {invitations.data.length === 0 && (
        <p className="text-center text-gray-500">No pending invitations</p>
      )}
    </div>
  );
}

type UserRowProps = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    role: string;
  };
  onRemove: (id: string) => Promise<void>;
  currentUserId: string;
};

function UserRow({ user, onRemove, currentUserId }: UserRowProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-gray-500">{user.emailAddress}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">Role: {user.role}</div>
        {user.id !== currentUserId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              setIsRemoving(true);
              try {
                await onRemove(user.id);
                toast.success("User removed");
              } catch (error) {
                toast.error("Failed to remove user");
              }
              setIsRemoving(false);
            }}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-500" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

type UserListProps = {
  users: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    role: string;
  }>;
  onRemove: (id: string) => Promise<void>;
  currentUserId: string;
};

function UserList({ users, onRemove, currentUserId }: UserListProps) {
  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onRemove={onRemove}
          currentUserId={currentUserId}
        />
      ))}
      {users.length === 0 && (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  );
}

export default function UsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<UsersData>({
    invitations: { data: [] },
    users: [],
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsersData();
      setUsersData(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check authorization
  if (!user || user.firstName?.toLowerCase().trim() !== "shourya") {
    router.push("/dashboard");
    return null;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const newInvitation = await createInvitation(email);
      setUsersData((prev) => ({
        ...prev,
        invitations: {
          data: [...prev.invitations.data, newInvitation],
        },
      }));
      toast.success("Invitation sent successfully");
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvitation(id);
      await fetchData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to revoke invitation";
      toast.error(message);
    }
  };

  const handleRemoveUser = async (id: string) => {
    try {
      await removeUser(id);
      await fetchData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove user";
      toast.error(message);
    }
  };

  return (
    <div className="container mx-auto min-h-screen w-full overflow-y-scroll p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Alert className="border-yellow-300 bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You can invite users to join the application. They will receive an
              email with instructions.
            </AlertDescription>
          </Alert>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void fetchData()}
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <form onSubmit={handleInvite} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isInviting || isLoading}>
            {isInviting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            <span className="ml-2">Invite User</span>
          </Button>
        </form>

        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <section>
              <h1 className="mb-6 text-3xl font-bold">Pending Invitations</h1>
              <PendingInvitationsList
                invitations={usersData.invitations}
                onRevoke={handleRevoke}
              />
            </section>

            <section className="mt-8">
              <h1 className="mb-6 text-3xl font-bold">All Users</h1>
              <UserList
                users={usersData.users}
                onRemove={handleRemoveUser}
                currentUserId={user.id}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
