"use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";

interface EditorProps {
  value: string;
}

export const EditorPreview = ({ value }: EditorProps) => {
  //   const ReactQuill = useMemo(
  //     () => dynamic(() => import("react-quill"), { ssr: false }),
  //     []
  //   );

  return (
    <div className="bg-background">
      <ReactQuill theme="bubble" value={value} />
    </div>
  );
};
