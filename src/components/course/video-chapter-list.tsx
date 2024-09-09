"use client";
import {
  getCourseChapters,
  reorderChapters,
  ChapterType,
} from "@/actions/chapters";
import { useCourseIdStore } from "@/store/courseStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Menu, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/spinner";

function VideoChapterList() {
  const queryClient = useQueryClient();
  const courseId = useCourseIdStore((state) => state.courseId);
  const [localChapters, setLocalChapters] = useState<ChapterType[]>([]);
  const router = useRouter();

  const { data: chapters, isPending } = useQuery({
    queryKey: ["videolist", courseId],
    queryFn: () => {
      return getCourseChapters(courseId ?? "");
    },
  });

  useEffect(() => {
    if (chapters) {
      setLocalChapters(chapters);
    }
  }, [chapters]);

  const reorderMutation = useMutation({
    mutationFn: (chapters: ChapterType[]) => {
      return reorderChapters(chapters);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videolist", courseId] });
    },
  });

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (!chapters) return;

    const newChapters = Array.from(localChapters);
    const [reorderedChapter] = newChapters.splice(result.source.index, 1);
    newChapters.splice(result.destination.index, 0, reorderedChapter);

    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }));

    setLocalChapters(updatedChapters);

    reorderMutation.mutate(updatedChapters);
  };

  if (isPending)
    return (
      <div className="flex justify-center mt-24">
        <Spinner />
      </div>
    );
  if (!localChapters.length)
    return <div>No chapters found. Please create a chapter.</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {localChapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex mb-4 backdrop-blur-md bg-white/10 p-2 border border-white/30 rounded-lg shadow-lg hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-700/20 dark:border-gray-600/30 dark:shadow-gray-800/30"
                    onClick={() => {
                      router.push(`/creator/course/chapter/${chapter.id}`);
                    }}
                  >
                    <div className="flex items-center">
                      <Menu className="mr-2" width={20} height={20} />
                      <div>{chapter.name}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <Badge
                        className={cn(
                          chapter.freePreview ? "visible" : "hidden"
                        )}
                      >
                        Free
                      </Badge>
                      <Badge
                        className={cn(
                          !chapter.published
                            ? ""
                            : "bg-green-500 px-5 hover:bg-green-600"
                        )}
                        variant={"destructive"}
                      >
                        {!chapter.published ? "Unpublished" : "Published"}
                      </Badge>
                      <Trash2 className="text-red-500" />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default VideoChapterList;
