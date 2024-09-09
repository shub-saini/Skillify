"use client";

import { boolean, z } from "zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileData, updateProfileBio } from "@/actions/profile";

interface UpdateBioParams {
  name: string;
  profession: string;
  linkedinUrl: string;
}

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Must contain atleast 4 characters" })
    .max(30, { message: "Only 30 characters allowed" }),
  profession: z
    .string()
    .min(4, { message: "Must contain atleast 4 characters" })
    .max(30, { message: "Only 30 characters allowed" }),
  linkedinUrl: z.string().min(8, { message: "Must be a valid URL" }),
});

function ProfileBioDialog({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>();

  const { data } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileData(userId),
  });

  const updateBio = useMutation({
    mutationFn: ({ name, profession, linkedinUrl }: UpdateBioParams) => {
      if (!userId) {
        return Promise.reject(new Error("User ID is not available"));
      }
      return updateProfileBio(userId, name, profession, linkedinUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      profession: data?.profession || "",
      linkedinUrl: data?.linkedinUrl || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateBio.mutate(values);
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-6">Edit your Bio</DialogTitle>
            <DialogDescription>
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
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Your profession" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LinkedIn Profile URL"
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

export default ProfileBioDialog;
