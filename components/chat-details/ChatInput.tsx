"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import EmojiPicker from "@/components/custom/EmojiPicker";
import AttachFile from "@/components/custom/AttachFile";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ chatId }: { chatId: string }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/socket/messages",
        query: { chatId },
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex px-5 py-1 gap-5 border-t">
                  <AttachFile chatId={chatId} />
                  <EmojiPicker
                    onChange={(emoji: string) =>
                      field.onChange(`${field.value} ${emoji}`)
                    }
                  />
                  <Input
                    disabled={isLoading}
                    placeholder="Type a message"
                    className="border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
