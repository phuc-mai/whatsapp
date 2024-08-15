"use client";

import { Message, User } from "@prisma/client";
import { Edit, File } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import qs from "query-string";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import DeleteMessageModal from "./DeleteMessageModal";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageBoxProps {
  user: User;
  isGroup: boolean;
  message: Message & { sender: User };
  chatId: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const MessageBox = ({ user, isGroup, message, chatId }: MessageBoxProps) => {
  const router = useRouter();

  const isOwner = message.senderId === user.id;
  const isFile = message.fileUrl !== null;
  const isFilePDF = isFile && message.content.includes(".pdf");
  const isImage = isFile && !isFilePDF;
  const canDelete = isOwner && !message.isDeleted;
  const canEdit = isOwner && !isFile && !message.isDeleted;

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: message.content,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/socket/messages/${message.id}`,
        query: { chatId },
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    form.reset({
      content: message.content,
    });
  }, [message.content]);

  const isLoading = form.formState.isSubmitting;

  return (
    <div
      className={`${
        isOwner ? "ml-auto" : "mr-auto"
      } flex items-start gap-3 group relative`}
    >
      {isGroup && !isOwner && (
        <Image
          src={message.sender.imageUrl}
          alt="sender"
          width={50}
          height={50}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div
        className={`flex flex-col gap-1 ${isOwner ? "items-end" : "items-start"}`}
      >
        {isFilePDF && (
          <div
            className={`${
              isOwner ? "bg-black text-white" : "bg-emerald-300 text-black "
            } flex items-center gap-2 p-2 rounded-md`}
          >
            <File size={16} />
            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
            >
              PDF File
            </a>
          </div>
        )}
        {isImage && (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className={`${isOwner ? "mr-auto" : "ml-auto"}`}
          >
            <Image
              src={message.content}
              alt={message.content}
              width={200}
              height={200}
              className="w-36 h-auto object-cover rounded-md"
            />
          </a>
        )}
        {!isFile && !isEditing && (
          <p
            className={`${message.isDeleted && "italic text-gray-500"} ${
              isOwner ? "bg-black text-white" : "bg-emerald-300 text-black "
            }  text-sm font-medium p-2 rounded-md`}
          >
            {message.content}
          </p>
        )}
        {!isFile && isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full gap-2"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="relative w-full">
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Edited message"
                          className="p-2 bg-gray-200 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit">
                Save
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => setIsEditing(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </form>
          </Form>
        )}
        <div className="flex gap-2 text-[8px] ml-2">
          <p>
            {message.isEdited
              ? format(new Date(message.updatedAt), "p")
              : format(new Date(message.createdAt), "p")}
          </p>
          {message.isEdited && <span>(Edited)</span>}
        </div>
      </div>
      {canDelete && !isEditing && (
        <div className="hidden group-hover:flex absolute -top-4 -right-2 bg-gray-200 border rounded-sm p-1 gap-2">
          <DeleteMessageModal chatId={chatId} messageId={message.id} />
          {canEdit && (
            <Edit
              size={10}
              className="cursor-pointer hover:text-red-500"
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
