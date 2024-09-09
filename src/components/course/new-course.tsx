"use client";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { makeNewCourse } from "@/actions/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Spinner from "@/components/spinner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Atleast write a name" }).max(50),
});

function NewCourse({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    newCourse.mutate({ userId: userId ?? "", name: values.name });
  }

  const newCourse = useMutation({
    mutationFn: ({ userId, name }: { userId: string; name: string }) => {
      return makeNewCourse(userId, name);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsOpen(false);
      router.push(`/creator/course/${data?.id}`);
    },
  });

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          {newCourse.isPending ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-4">
                  Name your course
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                autoFocus
                                placeholder="Course Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-x-4">
                        <Button type="submit">Create</Button>
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          variant={"outline"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default NewCourse;
