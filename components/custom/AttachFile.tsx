"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Paperclip } from "lucide-react";
import qs from "query-string";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";
import { useState } from "react";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});

const AttachFile = ({ chatId }: { chatId: string }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/socket/messages",
        query: { chatId },
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Failed to attach file", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Paperclip className="w-5 h-5 hover:text-red-500" strokeWidth={1.25} />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-center">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="messageFile"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttachFile;
