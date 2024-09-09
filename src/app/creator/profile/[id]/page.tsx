"use client";
import { getProfileData } from "@/actions/profile";
import About from "@/components/profile/about";
import ProfileBio from "@/components/profile/bio";
import Spinner from "@/components/spinner";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Picture from "@/components/picture/picture";
import { useEffect } from "react";

function Page({ params }: { params: { id: string } }) {
  const { userId } = useAuth();
  const { isPending } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileData(userId),
  });

  useEffect(() => {
    if (userId !== params.id) {
    }
  }, [userId, params.id]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-[calc(100vh-112px)]">
        <Spinner />
      </div>
    );
  } else
    return (
      <div className="px-14 md:mx-0 w-full">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="flex flex-col lg:flex-col md:flex-row gap-6 mx-auto">
            <div className="mb-6">
              <Picture type="profile" />{" "}
            </div>
            <div className="w-full">
              <ProfileBio />
            </div>
          </div>
          <div className="w-full">
            <About />
          </div>
        </div>
      </div>
    );
}

export default Page;
