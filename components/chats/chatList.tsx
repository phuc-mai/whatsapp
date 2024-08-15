"use client";

import { Edit, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Chat, ChatMember, Message, User } from "@prisma/client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import ChatBox from "./ChatBox";

interface ChatListProps {
  user: User;
  chatList: (Chat & {
    chatMembers: (ChatMember & { user: User })[];
    messages: Message[];
  })[];
}

const ChatList = ({ user, chatList }: ChatListProps) => {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(chatList);

  useEffect(() => {
    const searchLower = search.toLowerCase().trim();

    const filteredChats = chatList.filter((chat) => {
      if (chat.isGroup) {
        return chat.name?.toLowerCase().includes(searchLower);
      } else {
        const theOtherUser = chat.chatMembers.find(
          (chatMember) => chatMember.user.id !== user.id
        );
    
        // Check if the other user's name includes the search string
        return theOtherUser?.user.name.toLowerCase().includes(searchLower);
      }
    });
    setChats(filteredChats);
  }, [search, chatList, user.id]);

  return (
    <div className="h-full py-4 px-2 border-r overflow-hidden">
      <div className="flex justify-between items-center px-3">
        <h2 className="text-xl font-bold">Chats</h2>
        <Link href="/contacts">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Edit size={18} className="hover:text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium text-xs">Create new chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      </div>

      <div className="relative my-4 px-3">
        <span className="absolute inset-y-0 left-3 flex items-center pl-3">
          <Search size={14} className="text-gray-500" />
        </span>
        <Input
          type="text"
          className="pl-10"
          placeholder="Search chats..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatBox key={chat.id} user={user} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
