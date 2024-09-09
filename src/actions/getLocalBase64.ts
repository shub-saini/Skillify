"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPlaiceholder } from "plaiceholder";

export default async function getBase64(imageUrl: string) {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } catch (e) {
    if (e instanceof Error) console.log(e.stack);
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
  }
}
