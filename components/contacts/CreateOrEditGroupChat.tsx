"use client";

import { Chat, ChatMember, User } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/custom/FileUpload";
import SelectContacts from "./SelectContacts";
import { Loader2 } from "lucide-react";

interface CreateOrEditGroupChatProps {
  contacts: User[];
  page: "create" | "edit";
  chatDetails?: Chat & {
    chatMembers: (ChatMember & { user: User })[];
  };
}

const formSchema = z.object({
  name: z.string().min(2).max(20),
  imageUrl: z.string().optional(),
  members: z.array(z.string()).min(2, "At least 2 members required"),

});

const CreateOrEditGroupChat = ({
  contacts,
  page,
  chatDetails,
}: CreateOrEditGroupChatProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: chatDetails?.name ?? "",
      imageUrl: chatDetails?.imageUrl ?? "",
      members:
        chatDetails?.chatMembers?.map((chatMember) => chatMember.user.id) ?? [],
    },
  });

  const [selectedContacts, setSelectedContacts] = useState<User[]>([]);

  const handleSelectContact = (contact: User) => {
    setSelectedContacts((prevSelectedContacts) =>
      prevSelectedContacts.some((selected) => selected.id === contact.id)
        ? prevSelectedContacts.filter((selected) => selected.id !== contact.id)
        : [...prevSelectedContacts, contact]
    );
  };

  // Update the form field value when selectedContacts changes
  useEffect(() => {
    form.setValue("members", [
      ...selectedContacts.map((contact) => contact.id),
    ] as [string, ...string[]]);
  }, [selectedContacts, form]);

  useEffect(() => {
    if (page === "edit" && chatDetails?.chatMembers) {
      setSelectedContacts(chatDetails.chatMembers.map((cm) => cm.user));
    }
  }, [page, chatDetails]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let response;

      if (page === "create") {
        response = await axios.post("/api/group-chat", values);
        toast.success("New group chat created");
      } else if (page === "edit" && chatDetails?.id) {
        response = await axios.patch(
          `/api/group-chat/${chatDetails.id}`,
          values
        );
        toast.success("Group chat updated");
      }

      router.push(`/?queryId=${response?.data.id}`);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Failed to create or edit group chat", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 max-md:flex-col max-md:gap-5 md:gap-10 lg:gap-40 p-10"
      >
        <div className="flex flex-col space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Group Chat Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Chat Image</FormLabel>
                <FormControl>
                  <FileUpload
                    endpoint="groupChatImage"
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : page === "create" ? (
                "Create Group Chat"
              ) : (
                "Update Group Chat"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  `${
                    page === "create"
                      ? "/contacts"
                      : `/?queryId=${chatDetails?.id}`
                  }`
                )
              }
            >
              Cancel
            </Button>
          </div>
        </div>
        <div className="flex-1 max-w-96">
          <FormField
            control={form.control}
            name="members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Members <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex flex-wrap gap-2">
                  {selectedContacts.map((selectedContact) => (
                    <div
                      key={selectedContact.id}
                      className="flex items-center gap-2 p-2 rounded-md border bg-black text-white mb-3"
                    >
                      <Image
                        src={selectedContact.imageUrl}
                        alt={selectedContact.name}
                        width={50}
                        height={50}
                        className="rounded-full h-4 w-4"
                      />
                      <p className="text-xs">{selectedContact.name}</p>
                    </div>
                  ))}
                </div>
                <FormControl>
                  <SelectContacts
                    contacts={contacts}
                    selectedContacts={selectedContacts}
                    onSelectContact={handleSelectContact}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default CreateOrEditGroupChat;
