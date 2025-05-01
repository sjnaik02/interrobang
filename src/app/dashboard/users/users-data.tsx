"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export type UsersData = {
  invitations: {
    data: Array<{
      id: string;
      emailAddress: string;
      createdAt: string;
      status: string;
    }>;
  };
  users: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    role: string;
  }>;
};

export async function getUsersData(): Promise<UsersData> {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized: No user ID found");
    }

    const [invitations, users] = await Promise.all([
      clerkClient.invitations.getInvitationList(),
      clerkClient.users.getUserList(),
    ]);

    if (!invitations || !users) {
      throw new Error("Failed to fetch data from Clerk");
    }

    // Get all user email addresses to filter out invitations for existing users
    const existingEmails = new Set(
      users.data.flatMap((user) =>
        user.emailAddresses.map((email) => email.emailAddress.toLowerCase()),
      ),
    );

    // Convert to plain objects and filter invitations
    const plainInvitations = invitations.data
      .filter(
        (invitation) =>
          // Only include invitations that are pending and not for existing users
          invitation.status === "pending" &&
          !existingEmails.has(invitation.emailAddress.toLowerCase()),
      )
      .map((invitation) => ({
        id: invitation.id,
        emailAddress: invitation.emailAddress,
        createdAt: new Date(invitation.createdAt).toISOString(),
        status: invitation.status,
      }));

    const plainUsers = users.data.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
      role: (user.publicMetadata?.role as string) ?? "User",
    }));

    // Return only plain objects
    return {
      invitations: {
        data: plainInvitations,
      },
      users: plainUsers,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch users data:", {
        message: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to fetch users data: ${error.message}`);
    }
    console.error("Failed to fetch users data:", error);
    throw new Error("Failed to fetch users data: Unknown error");
  }
}
