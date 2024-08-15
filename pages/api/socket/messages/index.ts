import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { NextApiResponseServerIO } from "@/types";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { chatId } = req.query;
    const { content, fileUrl } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "Chat ID missing" });
    }

    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Content or File URL missing" });
    }

    const chat = await db.chat.findFirst({
      where: {
        id: chatId as string,
        chatMembers: {
          some: {
            userId: user?.id,
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        // chatId: chatId as string,
        chatId: chat.id,
        senderId: user.id
      },
    });

    // Update the chat's lastMessageAt field
    await db.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });

    // immediately emit a socket io to all active connections
    const addKey = `chat:${chatId}:messages`;
    res?.socket?.server?.io?.emit(addKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("messages_POST", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
