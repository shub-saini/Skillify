"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCourseIdStore } from "@/store/courseStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewChapter } from "@/actions/chapters";

const formSchema = z.object({
  chaptervideo: z.string().min(1, { message: "Name your Chapter" }).max(50),
});

function AddVideo() {
  const queryClient = useQueryClient();
  const courseId = useCourseIdStore((state) => state.courseId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chaptervideo: "",
    },
  });

  const newChapterMutation = useMutation({
    mutationFn: ({ courseId, name }: { courseId: string; name: string }) => {
      return addNewChapter(courseId ?? "", name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videolist"] });
      form.reset();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    newChapterMutation.mutate({
      courseId: courseId ?? "",
      name: values.chaptervideo,
    });
  }
  return (
    <div>
      <div className="flex gap-x-4 mt-4 w-full mb-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <div className="flex gap-x-4 w-full">
              <FormField
                control={form.control}
                name="chaptervideo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Chapter name"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddVideo;
