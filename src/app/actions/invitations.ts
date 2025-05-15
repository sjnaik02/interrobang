/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type InvitationResponse = {
  id: string;
  emailAddress: string;
  status: string;
  createdAt: string;
};

export const createInvitation = async (
  email: string,
): Promise<InvitationResponse> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
      publicMetadata: {
        invitedBy: userId,
      },
    });

    revalidatePath("/dashboard/users");

    // Return a plain object instead of the Clerk invitation object
    return {
      id: invitation.id,
      emailAddress: invitation.emailAddress,
      status: invitation.status,
      createdAt: new Date(invitation.createdAt).toISOString(),
    };
  } catch (error) {
    console.error("Failed to create invitation:", error);
    throw new Error("Failed to create invitation");
  }
};

export const revokeInvitation = async (invitationId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const client = await clerkClient();
    await client.invitations.revokeInvitation(invitationId);
    revalidatePath("/dashboard/users");
    return true;
  } catch (error) {
    console.error("Failed to revoke invitation:", error);
    throw new Error("Failed to revoke invitation");
  }
};

export const removeUser = async (userId: string) => {
  try {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    const client = await clerkClient();
    await client.users.deleteUser(userId);
    revalidatePath("/dashboard/users");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to remove user:", error);
      throw new Error(error.message);
    }
    throw new Error("Failed to remove user");
  }
};
