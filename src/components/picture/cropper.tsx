"use client";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useCroppedPictureStore,
  usePictureTypeStore,
  useSelectedPictureStore,
} from "@/store/pictureStore";

function ImageCropper() {
  const selectedImage = useSelectedPictureStore((state) => state.selectedImage);
  const cropperRef = useRef<ReactCropperElement>(null);
  const croppedImage = useCroppedPictureStore((state) => state.croppedImage);
  const setCroppedImage = useCroppedPictureStore(
    (state) => state.setCroppedImage
  );
  const pictureType = usePictureTypeStore((state) => state.pictureType);

  const getCropData = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
      if (croppedDataUrl) {
        setCroppedImage(croppedDataUrl);
      } else {
        console.error("Could not get cropped data URL");
      }
    } else {
      console.error("Cropper instance is not available");
    }
  };

  return (
    <div>
      <Cropper
        className={cn(croppedImage ? "hidden" : "visible")}
        src={selectedImage}
        style={{ height: 400, width: "100%" }}
        ref={cropperRef}
        aspectRatio={pictureType === "profile" ? 1 : 9 / 6}
        viewMode={1}
        guides={true}
        minCropBoxHeight={100}
        minCropBoxWidth={100}
        checkOrientation={false}
        background={false}
        responsive={true}
      />
      <div className="flex justify-end mt-2">
        <Button
          onClick={getCropData}
          className={cn(!croppedImage ? "visible" : "hidden")}
        >
          Crop Image
        </Button>
      </div>
      <Image
        src={croppedImage}
        alt="cropped image"
        width={400}
        height={400}
        className={cn(croppedImage ? "visible" : "hidden", "")}
      />
    </div>
  );
}

export default ImageCropper;
