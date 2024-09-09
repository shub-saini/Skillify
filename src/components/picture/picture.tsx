"use client";
import { getProfileData } from "@/actions/profile";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import PictureInput from "./picture-input";
import UploadDialog from "./upload-dialog";
import UploadedPicture from "./uploaded-picture";
import { useIsPictureLoading, usePictureTypeStore } from "@/store/pictureStore";
import Spinner from "../spinner";
import { useAuth } from "@clerk/nextjs";
import { useCourseIdStore } from "@/store/courseStore";
import { getCourseData } from "@/actions/course";
import { cn } from "@/lib/utils";

export default function Picture({ type }: { type: "profile" | "thumbnail" }) {
  const { userId } = useAuth();
  const setPictureType = usePictureTypeStore((state) => state.setPictureType);
  const [courseId, setCourseId] = useState<string | null>(null);
  const storedCourseId = useCourseIdStore((state) => state.courseId);

  useEffect(() => {
    setPictureType(type);
    if (type === "thumbnail") {
      setCourseId(storedCourseId);
    }
  }, [storedCourseId, courseId, setPictureType, type]);

  const { data } = useQuery({
    queryKey:
      type === "profile" ? ["profile", userId] : ["courseById", courseId],
    queryFn: async () => {
      if (type === "profile") {
        return await getProfileData(userId); // Fetch profile data for "profile" type
      } else if (type === "thumbnail" && courseId) {
        return await getCourseData(courseId ?? ""); // Fetch course data for "thumbnail" type
      }
      return null;
    },
    enabled:
      (type === "profile" && !!userId) || (type === "thumbnail" && !!courseId),
  });

  const isPictureLoading = useIsPictureLoading(
    (state) => state.isPictureLoading
  );

  return (
    <div>
      {isPictureLoading ? (
        <div
          className={cn(
            "flex justify-center items-center",
            type === "profile" ? "h-60 w-60" : "h-60 w-96"
          )}
        >
          <Spinner />
        </div>
      ) : data?.imageUrl ? (
        <UploadedPicture imageUrl={data?.imageUrl || ""} />
      ) : (
        <div>
          <PictureInput />
          <UploadDialog />
        </div>
      )}
    </div>
  );
}
