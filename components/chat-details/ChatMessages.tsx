"use client"

import { Chat, ChatMember, Message, User } from "@prisma/client";
import { useEffect, useRef } from "react";

import MessageBox from "../message/MessageBox";
import { useChatSocket } from "@/hooks/useChatSocket";

interface ChatMessagesProps {
  user: User;
  chatDetails: Chat & {
    chatMembers: (ChatMember & { user: User })[];
    messages: (Message & { sender: User })[];
  };
}

const ChatMessages = ({ user, chatDetails }: ChatMessagesProps) => {
  const queryKey = `chat:${chatDetails.id}`;
  const addKey = `chat:${chatDetails.id}:messages`;
  const updateKey = `chat:${chatDetails.id}:messages:update`;

  useChatSocket({ queryKey, addKey, updateKey });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatDetails.messages]);

  return (
    <div className='flex-1 flex flex-col gap-2 p-5 overflow-y-auto'>
      {chatDetails.messages.map((message) => (
        <MessageBox key={message.id} user={user} isGroup={chatDetails.isGroup} message={message} chatId={chatDetails.id} />
      ))}
    </div>
  )
}

export default ChatMessages