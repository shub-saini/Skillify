import { getProfileData } from "@/actions/profile";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { MoveUpRight, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProfileBioDialog from "@/components/profile/bio-dialog";

function ProfileBio() {
  const { userId } = useAuth();
  const { data } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileData(userId),
  });
  return (
    <div>
      <div className="mb-4 w-full">
        <div>Name:</div>

        <div className="text-3xl md:text-4xl">{data?.name}</div>
      </div>
      <div className="mb-4">
        <div>Profession:</div>
        <div className="text-2xl">{data?.profession}</div>
      </div>
      <div className="mb-4">
        <div>LinkedIn:</div>
        <div className="text-xl text-orange-600 hover:text-orange-200">
          <Link target="_blank" href={data?.linkedinUrl || "#"}>
            <div className="flex items-center hover:underline">
              <div>Visit</div>
              <MoveUpRight height={15} width={15} />
            </div>
          </Link>
        </div>
      </div>
      <div>
        <ProfileBioDialog>
          <Pencil className="hover:text-orange-600" />
        </ProfileBioDialog>
      </div>
    </div>
  );
}

export default ProfileBio;
