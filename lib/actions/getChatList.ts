import { db } from "../db";

export const getChatList = async (userId: string) => {
  const chats = await db.chat.findMany({
    where: {
      chatMembers: {
        some: {
          userId,
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

  return chats;
}