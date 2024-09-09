"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProfileImage } from "@/actions/profile";
import { useAuth } from "@clerk/nextjs";
import {
  usePictureInputEnableStore,
  usePictureTypeStore,
} from "@/store/pictureStore";
import { cn } from "@/lib/utils";
import getBase64 from "@/actions/getLocalBase64";
import { deleteCourseThumbnail } from "@/actions/course";
import { useCourseIdStore } from "@/store/courseStore";

type PictureData = {
  imageUrl: string;
};

function UploadedPicture({ imageUrl }: PictureData) {
  const [shouldRender, setShouldRender] = useState(false);
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const setProfileInputEnabled = usePictureInputEnableStore(
    (state) => state.setProfileInputEnabled
  );
  const setThumbnailInputEnabled = usePictureInputEnableStore(
    (state) => state.setThumbnailInputEnabled
  );
  const pictureType = usePictureTypeStore((state) => state.pictureType);
  const courseById = useCourseIdStore((state) => state.courseId);

  const { data: base64Data } = useQuery({
    queryKey: ["base64", imageUrl],
    queryFn: () => {
      return getBase64(imageUrl);
    },
    retry: 1,
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (imageUrl: string) => {
      return deleteProfileImage(userId, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setProfileInputEnabled(true);
    },
  });

  const deleteThumbnailMutation = useMutation({
    mutationFn: () => {
      return deleteCourseThumbnail(courseById ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseById"] });
      setThumbnailInputEnabled(true);
    },
  });

  useEffect(() => {
    if (base64Data) {
      setShouldRender(true);
    }
  }, [base64Data]);

  if (!shouldRender) {
    return (
      <div
        className={cn(
          "bg-gray-200 dark:bg-gray-600 animate-pulse rounded-md",
          pictureType === "profile" ? "h-60 w-60" : "h-60 w-96"
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative",
        pictureType === "profile" ? "h-60 w-60" : "h-60 w-96"
      )}
    >
      <Image
        className="rounded-md"
        src={imageUrl}
        alt="profile picture"
        fill
        priority={true}
        placeholder="blur"
        blurDataURL={base64Data}
      />
      <Dialog>
        <DialogTrigger>
          <X className="absolute -right-2 -top-2 bg-rose-500 text-white p-1 rounded-full shadow-sm hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              You want to remove this picture?
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-8">
            <DialogClose asChild>
              <Button
                onClick={async () => {
                  if (imageUrl) {
                    if (pictureType === "profile") {
                      deleteProfileMutation.mutate(imageUrl);
                    } else {
                      deleteThumbnailMutation.mutate();
                    }
                  }
                }}
              >
                Yes
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="">No</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadedPicture;
