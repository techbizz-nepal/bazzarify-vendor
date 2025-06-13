"use client";

import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
};

interface RichTextEditorProps {
  defaultValue?: string;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  ({ defaultValue }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
      if (editorRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["image"],
              ["clean"],
            ],
          },
          placeholder: "Write something...",
        });
        if (defaultValue) {
          quillRef.current.clipboard.dangerouslyPasteHTML(defaultValue);
        }
      }

      return () => {
        quillRef.current = null; // Cleanup to avoid memory leaks
      };
    }, [defaultValue]);

    // Expose the getContent function to the parent component
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML; // Return the HTML content
        }
        return "";
      },
    }));

    return <div ref={editorRef} style={{ height: "300px" }} />;
  },
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
