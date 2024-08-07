"use client";

import { Edit, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Chat, ChatMember, User } from "@prisma/client";
import axios from "axios";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import ChatBox from "./ChatBox";

interface ChatWithDetails extends Chat {
  chatMembers: (ChatMember & { user: User })[];
  messages: { content: string, fileUrl: string }[];
}

const ChatList = () => {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const getChats = async () => {
    try {
      const res = await axios.get("/api/chats");

      if (res.status !== 200) {
        throw new Error("Failed to get chats");
      }

      setChats(res.data);
    } catch (error) {
      console.error("Failed to get chats", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  const filterChats = () => {
    const searchLower = search.toLowerCase().trim();

    if (!searchLower) return chats;

    return chats.filter((chat) => {
      if (chat.isGroup) {
        return chat.name?.toLowerCase().includes(searchLower);
      } else {
        return chat.chatMembers.some((chatMember) =>
          chatMember.user.name.toLowerCase().includes(searchLower)
        );
      }
    });
  };

  const searchedChats: ChatWithDetails[] = filterChats();

  // useEffect(() => {
  //   const filterChats = () => {
  //     return chats.filter((chat) => {
  //       const chatName = chat.isGroup
  //         ? chat.name
  //         : chat.chatMembers.map((member) => member.user.name).join(", ");
  //       return chatName && chatName.toLowerCase().includes(search.toLowerCase());
  //     });
  //   };
  
  //   const filteredChats = filterChats();
  //   setFilteredChats(filteredChats);
  // }, [search, chats]);

  return (
    !loading && (
      <div className="h-full max-sm:hidden sm:w-[250px] md:w-[320px] lg:w-[360px] xl:w-96 py-4 px-2 border-r overflow-hidden">
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
          {searchedChats.map((chat) => (
            <ChatBox key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    )
  );
};

export default ChatList;
