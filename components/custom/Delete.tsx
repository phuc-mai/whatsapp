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

interface DeleteProps {
  item: string;
  chatId: string;
}

const Delete: React.FC<DeleteProps> = ({ item, chatId }) => {
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
        throw new Error(`Failed to delete ${item}`);
      }

      setIsDeleting(false);
      router.push("/");
      router.refresh();
      toast.success(`${item} deleted`);
    } catch (error) {
      console.log(`Failed to delete ${item}`, error);
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
          <AlertDialogTitle className="text-red-1">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {item}.
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

export default Delete;
