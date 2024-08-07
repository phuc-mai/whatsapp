import { loggedinUser } from "@/lib/actions/loggedinUser";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (
  req: NextApiRequest,
) => {
  try {
    const user = await loggedinUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chats = await db.chat.findMany({
      where: {
        chatMembers: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        chatMembers: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    return NextResponse.json(chats, { status: 200 });
  } catch (err) {
    console.log("[chats_search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
