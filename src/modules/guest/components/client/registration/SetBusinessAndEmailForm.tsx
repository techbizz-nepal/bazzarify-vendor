"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import { useRouter } from "next/navigation";

const SetBusinessAndEmail = () => {
  const router = useRouter();
  const {
    businessAndEmailForm: form,
    handleSetBusinessAndEmailSubmit: onSubmit,
  } = useVendorRegistration(router);

  return (
    <div className="px-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-col space-y-6"
        >
          <FormField
            name="business_name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormControl>
                  <Input
                    autoComplete="given-name"
                    className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                    placeholder="Store Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                    placeholder="Enter your business email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">Phone</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="mobile tel"
                    className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                    type="number"
                    placeholder="Enter phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="phone"
          />
          <ThemedButton className={cn(`text-md w-full cursor-pointer py-6`)}>
            Submit
          </ThemedButton>
        </form>
      </Form>
    </div>
  );
};

export default SetBusinessAndEmail;
