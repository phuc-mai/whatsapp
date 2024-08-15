"use client";

import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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


const DeleteChatModal = ({ chatId }: { chatId: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const url = `/api/group-chat/${chatId}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete chat`);
      }

      setIsDeleting(false);
      router.push("/");
      router.refresh();
      toast.success("Chat is deleted");
    } catch (error) {
      console.log("Failed to delete chat", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {isDeleting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Trash size={18} className="hover:text-red-500" />
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            chat.
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

export default DeleteChatModal;
