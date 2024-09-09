"use client";
import React, { useEffect, useState } from "react";
import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getProfileData, updateProfileAbout } from "@/actions/profile";
import { Pencil } from "lucide-react";
import { EditorPreview } from "../editor-preview";

function About() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const [value, setValue] = useState<string>("");
  const [isEditable, setIsEditable] = useState(false);

  const { data } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileData(userId),
  });

  useEffect(() => {
    if (data?.about) {
      setValue(data.about);
    }
  }, [data?.about]);

  const aboutMutate = useMutation({
    mutationFn: (content: string) => {
      return updateProfileAbout(userId || "", content);
    },
    onSuccess: () => {
      setIsEditable(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return (
    <div className="w-full">
      {isEditable ? (
        <div>
          <Button
            className="mb-6"
            onClick={() => {
              aboutMutate.mutate(value);
            }}
          >
            Save
          </Button>
          <Editor
            value={value}
            onChange={(value: string) => {
              setValue(value);
            }}
          />
        </div>
      ) : (
        <div className="w-full">
          <div className="">
            <Pencil
              className="hover:text-orange-600 ml-4"
              onClick={() => {
                setIsEditable(true);
              }}
            />
          </div>
          <EditorPreview value={value} />
        </div>
      )}
    </div>
  );
}

export default About;
