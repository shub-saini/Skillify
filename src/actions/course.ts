"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const makeNewCourse = async (authId: string, name: string) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    return await db.course.create({
      data: {
        title: name,
        creator: {
          connect: {
            clerkId: authId, // Connects the course to the creator table by clerkId
          },
        },
      },
    });
  } catch (error) {}
};

export const getCreatorCourses = async (authId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    const creator = await db.creator.findUnique({
      where: {
        clerkId: authId,
      },
      select: {
        id: true,
        courses: {
          select: {
            id: true,
            title: true,
            amount: true,
            published: true,
          },
        },
      },
    });

    if (!creator) {
      throw new Error("Creator not found");
    }

    return creator.courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const getCourseData = async (id: string) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    return await db.course.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {}
};

export const updateCourseData = async (
  id: string,
  title: string,
  price: number,
  description: string
) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    return await db.course.update({
      where: {
        id,
      },
      data: {
        title,
        amount: price,
        description,
      },
    });
  } catch (error) {}
};

export const updateCourseThumbnail = async (
  courseId: string,
  imageUrl: string
) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    return db.course.update({
      where: {
        id: courseId,
      },
      data: {
        imageUrl,
      },
    });
  } catch (error) {}
};

export const deleteCourseThumbnail = async (courseId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    return db.course.update({
      where: {
        id: courseId,
      },
      data: {
        imageUrl: "",
      },
    });
  } catch (error) {}
};
