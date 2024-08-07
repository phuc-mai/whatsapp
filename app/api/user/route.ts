import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export const GET = async (req: NextRequest) => {
  try {
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

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log("[user_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
