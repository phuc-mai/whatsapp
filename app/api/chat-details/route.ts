import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { loggedinUser } from "@/lib/actions/loggedinUser";
import { db } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, queryId } = await req.json();

    const loggedInUser = await loggedinUser();

    if (!loggedInUser) {
      return auth().redirectToSignIn();
    }

    if (loggedInUser.id !== userId) {
      return new NextResponse("User is not authorized to create or get chat", { status: 403 });
    }

    let chat = await db.chat.findFirst({
      where: {
        isGroup: false,
        AND: [
          {
            chatMembers: {
              some: {
                userId: userId,
              },
            },
          },
          {
            chatMembers: {
              some: {
                userId: queryId,
              },
            },
          },
        ],
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
        },
      },
    });

    if (!chat) {
      const groupChat = await db.chat.findFirst({
        where: {
          isGroup: true,
          id: queryId,
          chatMembers: {
            some: {
              userId: userId,
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
          },
        },
      });

      if (groupChat) {
        chat = groupChat;
      } else {
        chat = await db.chat.create({
          data: {
            isGroup: false,
            lastMessageAt: new Date(),
            chatMembers: {
              create: [{ userId: userId }, { userId: queryId }],
            },
            messages: { create: [] },
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
            },
          },
        });
      }
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    console.log("[chat-details_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
