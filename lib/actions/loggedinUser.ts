import { auth } from "@clerk/nextjs/server"

import { db } from "@/lib/db";

export const loggedinUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return auth().redirectToSignIn();
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  return user;
}