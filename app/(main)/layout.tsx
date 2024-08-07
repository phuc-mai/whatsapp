// "use client";

// import ChatDetails from "@/components/chat-details/ChatDetails";
// import EmptyChat from "@/components/chats/EmptyChat";
// import SideBar from "@/components/layout/SideBar";
// import { Chat, ChatMember, User } from "@prisma/client";
// import axios from "axios";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface ChatWithDetails extends Chat {
//   chatMembers: (ChatMember & { user: User })[];
//   messages: { content: string }[];
// }

// const HomepageLayout = ({ children }: { children: React.ReactNode }) => {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const [user, setUser] = useState<User | null>(null);
//   const [chatDetails, setChatDetails] = useState<ChatWithDetails | null>(null);

//   const queryId = searchParams?.get("queryId") ?? null;

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const res = await axios.get("/api/user");
//         setUser(res.data);
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//       }
//     };
//     getUser();
//   }, []);

//   useEffect(() => {
//     if (!queryId || !user) return;

//     const getChatDetails = async () => {
//       try {
//         const res = await axios.post("/api/chat-details", {
//           userId: user.id,
//           queryId: queryId,
//         });
//         setChatDetails(res.data);
//       } catch (error) {
//         console.error("Failed to fetch chat details:", error);
//       }
//     };

//     if (queryId) {
//       getChatDetails();
//     }
//   }, [user, queryId]);

//   return (
//     <div className="h-screen flex">
//       <SideBar />
//       {children}
//       {pathname === "/" &&
//         (chatDetails && user ? (
//           <ChatDetails user={user} chatDetails={chatDetails} />
//         ) : (
//           <EmptyChat />
//         ))}
//     </div>
//   );
// };

// export default HomepageLayout;
