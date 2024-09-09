"use server";

import db from "@/lib/db";
import { video } from "@/lib/mux";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createUploadUrl(chapterId: string) {
  try {
    const { userId } = auth();

    if (!userId) return redirect("/sign-in");

    const chapter = db.chapter.findUnique({
      where: {
        id: chapterId,
        course: {},
      },
    });

    const upload = await video.uploads.create({
      new_asset_settings: { playback_policy: ["public"] },
      cors_origin: "*",
    });
    return { uploadUrl: upload.url };
  } catch (error) {
    console.error("Failed to create upload URL", error);
    throw new Error("Failed to create upload URL");
  }
}
