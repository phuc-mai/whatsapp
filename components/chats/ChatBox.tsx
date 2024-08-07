"use client";

import { Chat, ChatMember, User } from "@prisma/client";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface ChatBoxProps {
  chat: Chat & {
    chatMembers: (ChatMember & { user: User })[];
    messages: { content: string; fileUrl: string }[];
  };
}

const ChatBox = ({ chat }: ChatBoxProps) => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("queryId");

  const { user } = useUser();

  if (!user) return redirect("/sign-in");

  const theOtherUser = !chat.isGroup
    ? chat.chatMembers.find((chatMember) => chatMember.user.clerkId !== user.id)
    : undefined;

  const chatImageUrl = chat.isGroup
    ? chat.imageUrl || "/group-placeholder.png"
    : theOtherUser?.user?.imageUrl || "/user-placeholder.jpg";

  const lastMessage =
    chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

  const queryId = chat.isGroup ? chat.id : theOtherUser?.userId;

  const isActive = chat.isGroup
    ? query?.includes(chat.id)
    : theOtherUser && query?.includes(theOtherUser.id);

  return (
    <Link
      className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
        isActive && "bg-gray-100"
      }`}
      href={`/?queryId=${queryId}`}
    >
      <Image
        src={chatImageUrl}
        alt={chat.id}
        width={50}
        height={50}
        className="rounded-full h-12 w-12"
      />
      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold">
            {chat.isGroup ? chat.name : theOtherUser?.user?.name}
          </p>
          <p className="text-xs text-gray-500">
            {!lastMessage
              ? format(new Date(chat?.createdAt), "p")
              : format(new Date(chat?.lastMessageAt), "p")}
          </p>
        </div>
        <p className="text-xs text-gray-500 truncate">
          {lastMessage
            ? lastMessage?.fileUrl
              ? "File Attachment"
              : lastMessage?.content
            : "Start a conversation"}
        </p>
      </div>
    </Link>
  );
};

export default ChatBox;