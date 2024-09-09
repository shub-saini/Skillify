"use server";

import db from "@/lib/db";
import { utapi } from "@/server/uploadthing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const updateProfileImage = async (
  authId: string | null | undefined,
  imageUrl: string
) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  try {
    if (authId) {
      return await db.creator.update({
        where: {
          clerkId: authId,
        },
        data: {
          imageUrl,
        },
      });
    }
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw new Error("Failed to update profile image");
  }
};

export const deleteProfileImage = async (
  authId: string | null | undefined,
  imageUrl: string
) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  try {
    if (authId) {
      utapi.deleteFiles(imageUrl);
      return await db.creator.update({
        where: {
          clerkId: authId,
        },
        data: {
          imageUrl: "",
        },
      });
    }
  } catch (error) {
    console.error("Error deleting profile image:", error);
    throw new Error("Failed to delete profile image");
  }
};

export const getProfileData = async (authId: string | null | undefined) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  try {
    if (authId) {
      return await db.creator.findUnique({
        where: {
          clerkId: authId,
        },
      });
    } else {
      throw new Error("authId is required to fetch profile data");
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
};

export const updateProfileBio = async (
  authId: string,
  name: string,
  profession: string,
  linkedinUrl: string
) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  try {
    if (authId) {
      return await db.creator.update({
        where: {
          clerkId: authId,
        },
        data: {
          name,
          profession,
          linkedinUrl,
        },
      });
    }
  } catch (error) {
    console.error("Error updating bio:", error);
    throw new Error("Error updating bio");
  }
};

export const updateProfileAbout = async (authId: string, content: string) => {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  try {
    if (authId) {
      return await db.creator.update({
        where: {
          clerkId: authId,
        },
        data: {
          about: content,
        },
      });
    }
  } catch (error) {
    console.error("Error updating About section:", error);
    throw new Error("Error updating About section");
  }
};
