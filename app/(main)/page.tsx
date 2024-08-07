import { getChatDetails } from "@/lib/actions/getChatDetails";
import { initialUser } from "@/lib/actions/initialUser";

import SideBar from "@/components/layout/SideBar";
import ChatList from "@/components/chats/chatList";
import ChatDetails from "@/components/chat-details/ChatDetails";
import EmptyChat from "@/components/chats/EmptyChat";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  const user = await initialUser();
  const queryId = searchParams?.queryId ?? null;

  let chatDetails;

  if (queryId) {
    chatDetails = await getChatDetails(user.id, queryId);
  }

  return (
    <div className="h-screen flex">
      <SideBar />
      <ChatList />
      {chatDetails && !(chatDetails instanceof Error) ? (
        <ChatDetails user={user} chatDetails={chatDetails} />
      ) : (
        <EmptyChat />
      )}
    </div>
  );
}