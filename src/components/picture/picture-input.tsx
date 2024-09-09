"use client";

import { cn } from "@/lib/utils";
import {
  useFileInputRefStore,
  usePictureInputEnableStore,
  usePictureTypeStore,
  useSelectedPictureStore,
  useUploadDialogStore,
} from "@/store/pictureStore";
import { Upload, UserRound } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef } from "react";

function PictureInput() {
  const pictureType = usePictureTypeStore((state) => state.pictureType);
  const localFileInputRef = useRef<HTMLInputElement | null>(null);
  const isProfileInputEnabled = usePictureInputEnableStore(
    (state) => state.isProfileInputEnabled
  );
  const isThumbnailInputEnabled = usePictureInputEnableStore(
    (state) => state.isThumbnailInputEnabled
  );
  const openUploadDialog = useUploadDialogStore(
    (state) => state.openUploadDialog
  );

  useEffect(() => {
    useFileInputRefStore.setState({ fileInputRef: localFileInputRef });
  }, [localFileInputRef]);

  const setSelectedImage = useSelectedPictureStore(
    (state) => state.setSelectedImage
  );

  const setSelectedFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      try {
        setSelectedImage(URL.createObjectURL(e.target.files[0]));
        openUploadDialog();
      } catch (error) {
        console.log(error);
        setSelectedImage("");
      }
    }
  };

  const isInputDisabled =
    (pictureType === "profile" && !isProfileInputEnabled) ||
    (pictureType === "thumbnail" && !isThumbnailInputEnabled);

  return (
    <div
      className={cn(
        "relative",
        pictureType === "profile" ? "h-60 w-60" : "h-60 w-96"
      )}
    >
      <div className="h-full w-full bg-orange-100 rounded-lg flex justify-center items-center cursor-pointer">
        {pictureType === "profile" ? (
          <UserRound width={400} height={400} color="black" />
        ) : (
          <div>
            <div className="flex justify-center">
              <Upload className="text-black text-center" />
            </div>
            <div className="text-black">Click to upload Thumbnail</div>
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className={cn(
            "opacity-0 absolute inset-0 cursor-pointer",
            isInputDisabled ? "cursor-not-allowed" : ""
          )}
          onChange={setSelectedFile}
          disabled={isInputDisabled}
          ref={localFileInputRef}
        />
      </div>
    </div>
  );
}

export default PictureInput;
