/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { type OrganizationCustomRoleKey } from "@clerk/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

const OrgInvitationsParams = {
  invitations: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

const SelectRole = (props: {
  fieldName?: string;
  isDisabled?: boolean;
  defaultRole?: string;
}) => {
  const { fieldName, isDisabled = false, defaultRole } = props;
  const { organization } = useOrganization();
  const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
  const isPopulated = useRef(false);

  useEffect(() => {
    if (isPopulated.current) return;
    void organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true;
        setRoles(res.data.map((roles) => roles.key));
      });
  }, [organization?.id]);

  if (fetchedRoles.length === 0) return null;

  return (
    <Select name={fieldName} defaultValue={defaultRole} disabled={isDisabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {fetchedRoles?.map((roleKey) => (
          <SelectItem key={roleKey} value={roleKey}>
            {roleKey}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const InviteMember = () => {
  const { isLoaded, organization, invitations } =
    useOrganization(OrgInvitationsParams);
  const [emailAddress, setEmailAddress] = useState("");
  const [disabled, setDisabled] = useState(false);

  if (!isLoaded || !organization) {
    return <>Loading</>;
  }

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submittedData = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as {
      email: string | undefined;
      role: OrganizationCustomRoleKey | undefined;
    };

    if (!submittedData.email || !submittedData.role) {
      return;
    }

    setDisabled(true);
    await organization.inviteMember({
      emailAddress: submittedData.email,
      role: submittedData.role,
    });
    await invitations?.revalidate?.();
    setEmailAddress("");
    setDisabled(false);
  };

  return (
    <Tabs defaultValue="invite">
      <TabsList className="mb-4">
        <TabsTrigger value="invite">Invite Member</TabsTrigger>
        <TabsTrigger value="add">Add Member</TabsTrigger>
      </TabsList>

      <TabsContent value="invite">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <SelectRole fieldName="role" />
          </div>
          <Button type="submit" disabled={disabled}>
            Invite
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="add">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              name="userId"
              type="text"
              placeholder="Enter Clerk User ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <SelectRole fieldName="role" />
          </div>
          <Button type="submit" disabled={disabled}>
            Add User
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

const InvitationList = () => {
  const { isLoaded, invitations, memberships } = useOrganization({
    ...OrgInvitationsParams,
    ...OrgMembersParams,
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations?.data?.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.emailAddress}</TableCell>
              <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>{inv.role}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    await inv.revoke();
                    await Promise.all([
                      memberships?.revalidate,
                      invitations?.revalidate,
                    ]);
                  }}
                >
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
          onClick={() => invitations?.fetchPrevious?.()}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          disabled={!invitations?.hasNextPage || invitations?.isFetching}
          onClick={() => invitations?.fetchNext?.()}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default function UsersPage() {
  const { organization } = useOrganization();
  const { user } = useUser();

  if (user?.firstName?.toLowerCase().trim() !== "shourya") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You are not authorized to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen w-full p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Users for {organization?.name}</h1>

          <Alert className="border-yellow-500 bg-yellow-50 text-yellow-900">
            <Building className="h-4 w-4" />
            <AlertTitle>Under construction</AlertTitle>
            <AlertDescription>
              User management is under development.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UserList organization={organization!} />

          <Card>
            <CardHeader>
              <CardTitle>Invite Members</CardTitle>
            </CardHeader>
            <CardContent>
              <InviteMember />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <InvitationList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
const UserList = ({
  organization,
}: {
  organization: NonNullable<ReturnType<typeof useOrganization>["organization"]>;
}) => {
  const [memberships, setMemberships] = useState<
    Array<{
      id: string;
      publicUserData: {
        imageUrl: string;
        firstName: string;
        lastName: string;
      };
    }>
  >([]);

  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    void organization.getMemberships().then((response) => {
      setMemberships(
        response.data.map((membership) => ({
          id: membership.id,
          publicUserData: {
            imageUrl: membership.publicUserData.imageUrl ?? "",
            firstName: membership.publicUserData.firstName ?? "",
            lastName: membership.publicUserData.lastName ?? "",
          },
        })),
      );
    });
  }, [organization]);

  const removeMember = async (userId: string) => {
    try {
      setIsRemoving(true);
      await organization.removeMember(userId);
      setMemberships((prev) => prev.filter((m) => m.id !== userId));
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Organization Users</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={membership.publicUserData.imageUrl}
                  alt={membership.publicUserData.firstName ?? "Profile picture"}
                />
                <AvatarFallback className="bg-pink-500">
                  {membership.publicUserData.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {membership.publicUserData.firstName +
                  " " +
                  membership.publicUserData.lastName}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => void removeMember(membership.id)}
              disabled={isRemoving}
            >
              Remove
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
