import { Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "@/components/providers/SocketProvider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithUser = Message & {
  sender: User;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Handle real-time message updates
    socket.on(updateKey, (message: MessageWithUser) => {
      queryClient.setQueryData<MessageWithUser[]>([queryKey], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((item) =>
          item.id === message.id ? message : item
        );
      });
    });

    // Handle real-time new message additions
    socket.on(addKey, (message: MessageWithUser) => {
      queryClient.setQueryData<MessageWithUser[]>([queryKey], (oldData) => {
        if (!oldData) {
          return [message];
        }

        return [message, ...oldData];
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
