import Image from "next/image";
import Link from "next/link";
import { Edit } from "lucide-react";

import { Chat, ChatMember, User } from "@prisma/client";
import { SocketIndicator } from "@/components/custom/SocketIndicator";
import DeleteChatModal from "@/components/chat-details/DeleteChatModal";

interface ChatHeaderProps {
  user: User;
  chatDetails: Chat & {
    chatMembers: (ChatMember & { user: User })[];
    messages: { content: string }[];
  };
}

const ChatHeader = ({ user, chatDetails }: ChatHeaderProps) => {
  let theOtherUser: (ChatMember & { user: User }) | undefined;

  if (!chatDetails.isGroup) {
    theOtherUser = chatDetails.chatMembers.find(
      (chatMember) => chatMember.userId !== user.id
    );
  }

  const chatName = chatDetails.isGroup
    ? chatDetails.name
    : theOtherUser?.user?.name;

  const chatImageUrl = chatDetails.isGroup
    ? chatDetails.imageUrl || "/group-placeholder.png"
    : theOtherUser?.user?.imageUrl || "/user-placeholder.jpg";

  const canEdit = chatDetails.isGroup && chatDetails.adminId === user.id;

  return (
    <div className="w-full px-5 py-2.5 flex items-center justify-between border-b">
      <div className="flex gap-3 items-center">
        <Image
          src={chatImageUrl}
          alt={chatName!}
          width={50}
          height={50}
          className="rounded-full h-10 w-10"
        />
        <p className="text-lg font-bold">{chatName}</p>
      </div>

      {canEdit && (
        <div className="flex gap-2">
          <DeleteChatModal chatId={chatDetails.id} />
          <Link href={`/group/${chatDetails.id}/edit`}>
            <Edit size={18} className="hover:text-red-500" />
          </Link>
        </div>
      )}
      <SocketIndicator />
    </div>
  );
};

export default ChatHeader;
