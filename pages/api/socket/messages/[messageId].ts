import { NextApiRequest } from "next";

import { NextApiResponseServerIO } from "@/types";
import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
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

    const { chatId, messageId } = req.query;
    const { content } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "Chat ID missing" });
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

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        // chatId: chatId as string,
        chatId: chat.id,
      },
      include: {
        sender: true,
      },
    });

    if (!message || message.isDeleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.senderId === user.id;

    if (!isMessageOwner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      await db.message.update({
        where: {
          id: message.id,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          isDeleted: true,
        },
        include: {
          sender: true,
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.message.update({
        where: {
          id: message.id,
        },
        data: {
          content,
          isEdited: true,
        },
        include: {
          sender: true,
        },
      });
    }

    const updateKey = `chat:${chat.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.error("[messageId]", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
