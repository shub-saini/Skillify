import { create } from "zustand";

type SelectedPicture = {
  selectedImage: string;
  setSelectedImage: (imageUrl: string) => void;
};

export const useSelectedPictureStore = create<SelectedPicture>((set) => ({
  selectedImage: "",
  setSelectedImage: (imageUrl) => set(() => ({ selectedImage: imageUrl })),
}));

type FileInputState = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  clearFileInput: () => void;
};

export const useFileInputRefStore = create<FileInputState>((set) => ({
  fileInputRef: { current: null },
  clearFileInput: () =>
    set((state) => {
      if (state.fileInputRef.current) {
        state.fileInputRef.current.value = "";
      }
      return {};
    }),
}));

type CroppedPicture = {
  croppedImage: string;
  setCroppedImage: (imageUrl: string) => void;
};

export const useCroppedPictureStore = create<CroppedPicture>((set) => ({
  croppedImage: "",
  setCroppedImage: (imageUrl) => set(() => ({ croppedImage: imageUrl })),
}));

interface PictureInputEnable {
  isProfileInputEnabled: boolean;
  isThumbnailInputEnabled: boolean;
  setProfileInputEnabled: (enabled: boolean) => void;
  setThumbnailInputEnabled: (enabled: boolean) => void;
}

export const usePictureInputEnableStore = create<PictureInputEnable>((set) => ({
  isProfileInputEnabled: true,
  isThumbnailInputEnabled: true,
  setProfileInputEnabled: (enabled) => set({ isProfileInputEnabled: enabled }),
  setThumbnailInputEnabled: (enabled) =>
    set({ isThumbnailInputEnabled: enabled }),
}));

type UploadDialogProps = {
  isUploadDialogOpen: boolean;
  openUploadDialog: () => void;
  closeUploadDialog: () => void;
};

export const useUploadDialogStore = create<UploadDialogProps>((set) => ({
  isUploadDialogOpen: false,
  openUploadDialog: () => set({ isUploadDialogOpen: true }),
  closeUploadDialog: () => set({ isUploadDialogOpen: false }),
}));

type IsPictureLoadingStore = {
  isPictureLoading: boolean;
  setPictureIsLoading: (value: boolean) => void;
};

export const useIsPictureLoading = create<IsPictureLoadingStore>((set) => ({
  isPictureLoading: false,
  setPictureIsLoading: (value) => set(() => ({ isPictureLoading: value })),
}));

type PictureType = {
  pictureType: string;
  setPictureType: (type: "profile" | "thumbnail") => void;
};

export const usePictureTypeStore = create<PictureType>((set) => ({
  pictureType: "",
  setPictureType: (type: "profile" | "thumbnail") =>
    set(() => ({ pictureType: type })),
}));
