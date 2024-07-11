"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { commentValidation } from "@/lib/validations/thread";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { addComment } from "@/lib/actions/thread.actions";

const Comment = ({
  threadId,
  currentUserImg,
  currentUserId,
}: {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
      accoutId: JSON.parse(currentUserId),
    },
  });

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    await addComment(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
    // router.push("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4 w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className=" no-focus border-none  bg-transparent text-light-1 ">
                <Input
                  type="text"
                  placeholder="Add a comment.."
                  className="text-light-1 no-focus outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
