import { actionStoreSlider } from "@/modules/marketing/domain/slider/actions/actionStoreSlider";
import { CreateSlider } from "@/modules/marketing/domain/slider/schemas/CreateSlider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function useCreateForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const form = useForm<z.infer<typeof CreateSlider>>({
    resolver: zodResolver(CreateSlider),
    defaultValues: {
      title: "",
      status: "",
      files: files,
    },
  });

  const router = useRouter();
  const handleDrop = (files: File[]) => {
    setFiles(files);
  };

  function onSubmit(values: z.infer<typeof CreateSlider>) {
    values.files = files;
    if (values.files.length < 1) {
      form.setError("files", {
        type: "custom",
        message: "Select at least a image",
      });
      return;
    }
    actionStoreSlider(values).then((result) => {
      if ("slider" in result) {
        toast.success("Slider created successfully!");
        form.reset();
        setFiles([]);
        setInitialImages([]);
        router.replace("/sliders");
      }
    });
  }
  return {
    form,
    onSubmit,
    files,
    handleDrop,
    initialImages,
  };
}
