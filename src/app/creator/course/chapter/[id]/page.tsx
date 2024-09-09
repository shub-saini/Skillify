"use client";
import { useCourseIdStore } from "@/store/courseStore";
import { ChevronLeft, FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const courseById = useCourseIdStore((state) => state.courseId);
  return (
    <div className="px-14 md:mx-0 w-full">
      <div className="flex justify-between">
        <div
          className="hover:cursor-pointer hover:text-orange-600"
          onClick={() => {
            router.push(`/creator/course/${courseById}`);
          }}
        >
          <ChevronLeft height={35} width={35} />
        </div>
        <div className="flex items-center gap-x-2 mb-6">
          <FilePenLine height={35} width={35} />
          <div className="text-2xl sm:text-3xl font-bold">
            Edit your chapter
          </div>
        </div>
      </div>
    </div>
  );
}
