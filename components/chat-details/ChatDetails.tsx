import { Chat, ChatMember, Message, User } from "@prisma/client"
import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"

interface ChatDetailsProps {
  user: User;
  chatDetails: Chat & {
    chatMembers: (ChatMember & { user: User })[];
    messages: (Message & { sender: User })[];
  };
}

const ChatDetails = ({ user, chatDetails }: ChatDetailsProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ChatHeader user={user} chatDetails={chatDetails}/>
      <ChatMessages user={user} chatDetails={chatDetails} />
      <ChatInput chatId={chatDetails.id} />
    </div>
  )
}

export default ChatDetails