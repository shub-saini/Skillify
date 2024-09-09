"use client";
import { getCourseData } from "@/actions/course";
import AddVideo from "@/components/course/add-video";
import CourseInfo from "@/components/course/course-info";
import VideoChapterList from "@/components/course/video-chapter-list";
import Spinner from "@/components/spinner";
import { useCourseIdStore } from "@/store/courseStore";
import { useQuery } from "@tanstack/react-query";
import { Box, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const setCourseId = useCourseIdStore((state) => state.setCourseId);

  useEffect(() => {
    setCourseId(params.id);
  });

  const { data, isError, isPending } = useQuery({
    queryKey: ["courseById", params.id],
    queryFn: () => {
      return getCourseData(params.id ?? "");
    },
  });

  useEffect(() => {
    if (!isPending && (!data || isError)) {
      router.push("/creator/courses");
    }
  }, [data, isPending, isError, router]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-112px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-14 md:mx-0 w-full">
      <div className="flex justify-between">
        <div
          className="hover:cursor-pointer hover:text-orange-600"
          onClick={() => {
            router.push("/creator/courses");
          }}
        >
          <ChevronLeft height={35} width={35} />
        </div>
        <div className="flex items-center gap-x-2 mb-6">
          <Box height={35} width={35} />
          <div className="text-2xl sm:text-3xl font-bold">
            Customize your Course
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-x-6">
        <div className="w-full">
          <CourseInfo />
        </div>
        <div className="w-full">
          <AddVideo />
          <VideoChapterList />
        </div>
      </div>
    </div>
  );
}

export default Page;
