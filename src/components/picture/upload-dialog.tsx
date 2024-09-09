"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ImageCropper from "@/components/picture/cropper";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/actions/profile";
import { useAuth } from "@clerk/nextjs";
import {
  useCroppedPictureStore,
  useFileInputRefStore,
  useIsPictureLoading,
  usePictureInputEnableStore,
  usePictureTypeStore,
  useSelectedPictureStore,
  useUploadDialogStore,
} from "@/store/pictureStore";
import { useCourseIdStore } from "@/store/courseStore";
import { updateCourseThumbnail } from "@/actions/course";

function UploadDialog() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const closeUploadDialog = useUploadDialogStore(
    (state) => state.closeUploadDialog
  );
  const isUploadDialogOpen = useUploadDialogStore(
    (state) => state.isUploadDialogOpen
  );

  const setSelectedImage = useSelectedPictureStore(
    (state) => state.setSelectedImage
  );
  const setCroppedImage = useCroppedPictureStore(
    (state) => state.setCroppedImage
  );
  const croppedImage = useCroppedPictureStore((state) => state.croppedImage);

  const setPictureIsLoading = useIsPictureLoading(
    (state) => state.setPictureIsLoading
  );

  const setProfileInputEnabled = usePictureInputEnableStore(
    (state) => state.setProfileInputEnabled
  );
  const setThumbnailInputEnabled = usePictureInputEnableStore(
    (state) => state.setThumbnailInputEnabled
  );

  const pictureType = usePictureTypeStore((state) => state.pictureType);
  const courseById = useCourseIdStore((state) => state.courseId);
  const { toast } = useToast();

  const clearFileInput = useFileInputRefStore((state) => state.clearFileInput);

  const uploadProfilePictureMutation = useMutation({
    mutationFn: (imageUrl: string) => {
      return updateProfileImage(userId, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const uploadThumbnailMutation = useMutation({
    mutationFn: (imageUrl: string) => {
      return updateCourseThumbnail(courseById ?? "", imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseById"] });
    },
  });

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (response) => {
      toast({ title: "Uploaded successfully!", variant: "message" });
      const url = response?.[0]?.url;
      if (pictureType === "profile") {
        uploadProfilePictureMutation.mutate(url);
      } else {
        uploadThumbnailMutation.mutate(url);
      }
      setPictureIsLoading(false);
      setCroppedImage("");
      setSelectedImage("");
    },
    onUploadError: () => {
      toast({
        title: "Error occurred while uploading",
        variant: "destructive",
      });
      setCroppedImage("");
      setSelectedImage("");
      if (pictureType === "profile") {
        setProfileInputEnabled(true);
      } else {
        setThumbnailInputEnabled(true);
      }
      setPictureIsLoading(false);
    },
    onUploadBegin: () => {
      setPictureIsLoading(true);
      toast({ title: "Picture Uploading...", variant: "message" });
    },
  });

  const uploadCropped = () => {
    if (pictureType === "profile") {
      setProfileInputEnabled(false);
    } else {
      setThumbnailInputEnabled(false);
    }
    const croppedDataUrl = croppedImage;
    const blobData = dataURLtoBlob(croppedDataUrl);
    const file = new File([blobData], "cropped-image.png", {
      type: "image/png",
    });
    setPictureIsLoading(true);
    startUpload([file]);
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div>
      <AlertDialog
        open={isUploadDialogOpen}
        onOpenChange={closeUploadDialog}
        defaultOpen={isUploadDialogOpen}
      >
        <AlertDialogContent
          className={cn(croppedImage ? "max-w-md" : "sm:max-w-2xl")}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className={cn(!croppedImage ? "visible" : "hidden")}
            >
              Crop your Picture
            </AlertDialogTitle>
            <AlertDialogDescription>
              <ImageCropper />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedImage("");
                setCroppedImage("");
                clearFileInput();
              }}
              className="bg-red-600 px-7"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(croppedImage ? "visible" : "hidden")}
              onClick={uploadCropped}
            >
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UploadDialog;
