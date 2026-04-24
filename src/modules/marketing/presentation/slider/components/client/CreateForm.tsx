"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { SliderStatus } from "@/modules/marketing/domain/slider/enums/SliderStatus";
import useCreateForm from "@/modules/marketing/presentation/slider/hooks/useCreateForm";
import ImageUploader from "@/modules/product.management/ui/ImageUploader";

export default function CreateForm() {
  const { form, onSubmit, handleDrop, initialImages } = useCreateForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="slider 1" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/marketing" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormLabel>Upload images</FormLabel>
              <FormControl>
                <ImageUploader
                  onImageSelect={handleDrop}
                  initialImages={initialImages}
                />
              </FormControl>
              <FormDescription>Select maximum 5 images</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Status</FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <NativeSelectOption value="">
                    Select status
                  </NativeSelectOption>
                  {Object.entries(SliderStatus).map(([key, value]) => (
                    <NativeSelectOption key={key} value={value}>
                      {key}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
