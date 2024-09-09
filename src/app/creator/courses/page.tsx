"use client";
import { getCreatorCourses } from "@/actions/course";
import NewCourse from "@/components/course/new-course";
import Spinner from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useAuth();

  const { data, isPending } = useQuery({
    queryKey: ["courses", userId],
    queryFn: () => {
      return getCreatorCourses(userId || "");
    },
  });

  const filteredCourses = data?.filter((course) => {
    if (course.title)
      return course.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return isPending ? (
    <div className="flex justify-center items-center w-full h-[calc(100vh-112px)]">
      <Spinner />
    </div>
  ) : (
    <div className="px-14 md:mx-0 w-full">
      <NewCourse>
        <Button className="mb-6">Create A New Course</Button>
      </NewCourse>
      <Input
        autoFocus
        type="text"
        placeholder="Search courses by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 w-full border border-gray-300 rounded-lg"
      />
      <Table className="">
        <TableCaption>A list of your created courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead className="">Published</TableHead>
            <TableHead className="">Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses?.map((item, index) => {
            return (
              <TableRow
                key={index}
                onClick={() => router.push(`/creator/course/${item.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="">{item.title}</TableCell>
                <TableCell>
                  {item.published ? (
                    <Badge className="bg-green-500">Published</Badge>
                  ) : (
                    <Badge className="bg-red-500">Unpublished</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.amount.toString() === "0" ? (
                    <Badge className="font-semibold">FREE</Badge>
                  ) : (
                    <Badge className="bg-green-500">
                      Rs. {item.amount.toString()}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ChevronRight />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default Page;
