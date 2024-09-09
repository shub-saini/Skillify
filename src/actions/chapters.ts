"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getCourseChapters = async (courseId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    return await db.chapter.findMany({
      where: { courseId: courseId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        published: true,
        freePreview: true,
        order: true,
      },
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw new Error("Failed to get chapters");
  }
};

export type ChapterType = {
  id: string;
  name: string;
  published: boolean;
  freePreview: boolean;
  order: number;
};

export const reorderChapters = async (chapters: ChapterType[]) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    await db.$transaction(async (tx) => {
      for (let chapter of chapters) {
        await tx.chapter.update({
          where: { id: chapter.id },
          data: { order: chapter.order },
        });
      }
    });
  } catch (error) {
    console.error("Error reordering chapters:", error);
    throw new Error("Failed to Reorder Chapters");
  }
};

export const addNewChapter = async (courseId: string, name: string) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    const highestOrderChapter = await db.chapter.findFirst({
      where: { courseId: courseId },
      orderBy: { order: "desc" },
    });

    const newOrder = highestOrderChapter ? highestOrderChapter.order + 1 : 1;

    const newChapter = await db.chapter.create({
      data: {
        courseId: courseId,
        name: name,
        order: newOrder,
        // Default values
        published: false,
        freePreview: false,
        description: "",
      },
    });

    return newChapter;
  } catch (error) {
    console.error("Error adding new chapter:", error);
    throw new Error("Failed to add new chapter");
  }
};
