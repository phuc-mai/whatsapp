import { Chat, ChatMember, User } from "@prisma/client"
import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"

interface ChatBoxProps {
  user: User;
  chatDetails: Chat & {
    chatMembers: (ChatMember & { user: User })[];
    messages: { content: string }[];
  };
}

const ChatDetails = ({ user, chatDetails }: ChatBoxProps) => {
  let theOtherUser: (ChatMember & { user: User }) | undefined;

  if (!chatDetails.isGroup) {
    theOtherUser = chatDetails.chatMembers.find(
      (chatMember) => chatMember.userId !== user.id
    );
  }

  const chatName = chatDetails.isGroup ? chatDetails.name : theOtherUser?.user?.name

  const chatImageUrl = chatDetails.isGroup
  ? chatDetails.imageUrl || "/group-placeholder.png"
  : theOtherUser?.user?.imageUrl || "/user-placeholder.jpg";

 
  return (
    <div className="h-full flex flex-col flex-1">
      <ChatHeader chatName={chatName!} chatImageUrl={chatImageUrl} userId={user.id} chatDetails={chatDetails}/>
      <ChatMessages />
      <ChatInput chatId={chatDetails.id} />
    </div>
  )
}

export default ChatDetails