"use client";

import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import qs from "query-string";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";

interface DeleteMessageModalProps {
  chatId: string;
  messageId: string;
}

const DeleteMessageModal = ({ chatId, messageId }: DeleteMessageModalProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/socket/messages/${messageId}`,
        query: { chatId },
      });

      await axios.delete(url);
      router.refresh();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {isDeleting ? (
          <Loader2 size={10} className="animate-spin" />
        ) : (
          <Trash size={10} className="hover:text-red-500" />
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMessageModal;
