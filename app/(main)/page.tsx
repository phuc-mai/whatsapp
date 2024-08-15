import { initialUser } from "@/lib/actions/initialUser";
import { getChatList } from "@/lib/actions/getChatList";
import { getChatDetails } from "@/lib/actions/getChatDetails";

import ChatList from "@/components/chats/chatList";
import ChatDetails from "@/components/chat-details/ChatDetails";
import EmptyChat from "@/components/chat-details/EmptyChat";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  const user = await initialUser();

  const chatList = await getChatList(user.id);

  const queryId = searchParams?.queryId ?? null;

  let chatDetails;

  if (queryId) {
    chatDetails = await getChatDetails(user.id, queryId);
  }

  return (
    <div className="h-screen flex flex-1">
      <div
        className={`${
          queryId
            ? "max-md:hidden md:w-[320px] lg:w-[360px] xl:w-[400px]"
            : "max-md:flex-1 min-w-80 lg:w-[360px] xl:w-[400px]"
        }`}
      >
        <ChatList user={user} chatList={chatList} />
      </div>
      <div className="flex-1 max-md:hidden">
        {queryId && chatDetails ? (
          <ChatDetails user={user} chatDetails={chatDetails} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}
