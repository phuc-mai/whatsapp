import Image from "next/image";

import Delete from "../custom/Delete";
import { Chat } from "@prisma/client";
import { SocketIndicator } from "../custom/SocketIndicator";

interface ChatHeaderProps {
  chatName: string;
  chatImageUrl: string;
  userId: string;
  chatDetails: Chat;
}

const ChatHeader = ({ chatName, chatImageUrl, userId, chatDetails }: ChatHeaderProps) => {
  const canDelete = chatDetails.isGroup && chatDetails.adminId === userId;

  return (
    <div className="w-full px-5 py-2.5 flex items-center justify-between border-b">
      <div className="flex gap-3 items-center">
        <Image
          src={chatImageUrl}
          alt={chatName}
          width={50}
          height={50}
          className="rounded-full h-10 w-10"
        />
        <p className="text-lg font-bold">{chatName}</p>
      </div>
      
      {/* {canDelete && <Delete item="Group chat" chatId={chatDetails.id} />} */}
      <SocketIndicator />
    </div>
  );
};

export default ChatHeader;
