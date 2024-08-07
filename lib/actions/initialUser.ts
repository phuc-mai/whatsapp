import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialUser = async () => {
  const loggedInUser = await currentUser();

    if (!loggedInUser) {
      return auth().redirectToSignIn();
    }

    let user;

    user = await db.user.findUnique({
      where: {
        clerkId: loggedInUser.id,
      },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          clerkId: loggedInUser.id,
          email: loggedInUser.emailAddresses[0].emailAddress,
          name: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
          imageUrl: loggedInUser.imageUrl,
        },
      });
    }


  return user;
}