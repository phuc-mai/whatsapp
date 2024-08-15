import { NextRequest, NextResponse } from "next/server";

import { loggedinUser } from "@/lib/actions/loggedinUser";
import { db } from "@/lib/db";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { groupChatId: string } }
) => {
  try {
    const user = await loggedinUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.groupChatId) {
      return new NextResponse("Group chat ID missing", { status: 400 });
    }

    await db.chat.delete({
      where: {
        id: params.groupChatId,
        adminId: user.id,
      },
    });

    return new NextResponse("Group chat deleted", { status: 200 });
  } catch (err) {
    console.log("[groupChatId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { groupChatId: string } }
) => {
  try {
    const user = await loggedinUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.groupChatId) {
      return new NextResponse("Group chat ID missing", { status: 400 });
    }

    const { name, imageUrl, members } = await req.json();

    // Ensure the user is included in the members list
    const allMembers = new Set([user.id, ...members]);

    // Update the group chat details and members
    const updatedGroupChat = await db.chat.update({
      where: {
        id: params.groupChatId,
        adminId: user.id, // Ensure that only the admin can update the group chat
      },
      data: {
        name,
        imageUrl,
        chatMembers: {
          deleteMany: {}, // Remove all existing members
          create: Array.from(allMembers).map((memberId: string) => ({
            userId: memberId,
          })),
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

    return NextResponse.json(updatedGroupChat, { status: 200 });
  } catch (err) {
    console.log("[groupChatId_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
