import { create } from "zustand";

type CourseIdType = {
  courseId: string | null;
  setCourseId: (id: string) => void;
};

export const useCourseIdStore = create<CourseIdType>((set) => ({
  courseId: null,
  setCourseId: (id) => set({ courseId: id }),
}));
