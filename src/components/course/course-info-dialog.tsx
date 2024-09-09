"use client";
import { getCourseData, updateCourseData } from "@/actions/course";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCourseIdStore } from "@/store/courseStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";

const formSchema = z.object({
  courseName: z.string().min(2, {
    message: "Course name must be at least 2 characters.",
  }),
  amount: z.number().nonnegative({ message: "Price cannot be negative" }),
  description: z.string().min(1).max(500),
});

function CourseInfoDialog({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const courseId = useCourseIdStore((state) => state.courseId);
  const [isOpen, setIsOpen] = useState<boolean>();

  const { data } = useQuery({
    queryKey: ["courseById", courseId],
    queryFn: () => {
      return getCourseData(courseId ?? "");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: data?.title || "",
      amount: data?.amount || 0,
      description: data?.description || "",
    },
  });

  const updateCourseDataMutation = useMutation({
    mutationFn: ({
      courseId,
      title,
      price,
      description,
    }: {
      courseId: string;
      title: string;
      price: number;
      description: string;
    }) => {
      return updateCourseData(courseId, title, price, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseById"] });
      setIsOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateCourseDataMutation.mutate({
      courseId: courseId ?? "",
      title: values.courseName,
      price: values.amount,
      description: values.description,
    });
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your course Info</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Course Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            value={field.value as number}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-64"
                            placeholder="Course Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CourseInfoDialog;
