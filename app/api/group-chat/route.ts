import { loggedinUser } from "@/lib/actions/loggedinUser";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await loggedinUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, imageUrl, members } = await req.json();

    if (!name || members.length < 2) {
      return new NextResponse("Name or at least 2 members missing", {
        status: 400,
      });
    }

    const groupChat = await db.chat.create({
      data: {
        isGroup: true,
        name,
        imageUrl,
        lastMessageAt: new Date(),
        adminId: user.id,
        chatMembers: {
          create: [
            ...members.map((memberId: string) => ({
              userId: memberId,
            })),
            {
              userId: user.id,
            },
          ],
        },
      },
      include: {
        chatMembers: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(groupChat, { status: 200 });
  } catch (err) {
    console.log("[group-chat_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
