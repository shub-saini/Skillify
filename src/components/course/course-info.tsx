import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useCourseIdStore } from "@/store/courseStore";
import { getCourseData } from "@/actions/course";
import { Pencil } from "lucide-react";
import CourseInfoDialog from "@/components/course/course-info-dialog";
import Picture from "../picture/picture";

function CourseInfo() {
  const courseId = useCourseIdStore((state) => state.courseId);

  const { data } = useQuery({
    queryKey: ["courseById", courseId],
    queryFn: () => {
      return getCourseData(courseId ?? "");
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-x-2">
            <span className="mb-1">Course Data</span>
            <CourseInfoDialog>
              <Pencil
                height={20}
                width={20}
                className="hover:text-orange-600"
              />
            </CourseInfoDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span>Name:</span>
          <CardDescription>{data?.title}</CardDescription>
        </CardContent>
        <CardContent>
          <span>Amount:</span>
          <CardDescription>{data?.amount}</CardDescription>
        </CardContent>
        <CardContent>
          <span>Description:</span>
          <CardDescription className="prose">
            <span className="whitespace-pre-wrap">{data?.description}</span>
          </CardDescription>
        </CardContent>
        <CardContent>
          <span>Thumbnail:</span>
          <div>
            <Picture type="thumbnail" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseInfo;
