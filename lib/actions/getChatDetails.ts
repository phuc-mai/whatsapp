import { db } from "@/lib/db";

export const getChatDetails = async (userId: string, queryId: string) => {
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
          createdAt: "asc",
        },
        include: {
          sender: true,
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
            createdAt: "asc",
          },
          include: {
            sender: true,
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
              createdAt: "asc",
            },
            include: {
              sender: true,
            },
          },
        },
      });
    }
  }

  return chat;
};
