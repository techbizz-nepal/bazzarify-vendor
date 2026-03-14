"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import useStoreSetupForm from "@/modules/vendor/hooks/useStoreSetupForm";
import { TStoreTypeOption } from "@/modules/vendor/domain/schemas/storeOnboarding";
import { useRouter } from "next/navigation";

interface SetBusinessAndEmailProps {
  redirectTo?: string | null;
  storeTypeOptions?: TStoreTypeOption[];
}

const SetBusinessAndEmail = ({
  redirectTo,
  storeTypeOptions = [],
}: SetBusinessAndEmailProps) => {
  const router = useRouter();
  const {
    storeSetupForm: form,
    handleStoreSetupSubmit: onSubmit,
  } = useStoreSetupForm(router, {
    redirectTo,
    hasStoreTypeOptions: storeTypeOptions.length > 0,
  });

  const selectedStoreTypeUuid = form.watch("store_type_uuid");
  const selectedStoreType = storeTypeOptions.find(
    (option) => option.uuid === selectedStoreTypeUuid,
  );
  const starterCategories =
    selectedStoreType?.onboarding_category_set?.categories ?? [];

  return (
    <div className="px-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-col space-y-6"
        >
          <FormField
            name="store_type_uuid"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-lg font-bold">Store Type</FormLabel>
                <FormDescription className="text-xs">
                  Choose the starter catalog that best fits your store.
                </FormDescription>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={storeTypeOptions.length === 0}
                  >
                    <SelectTrigger className="w-full border border-slate-300">
                      <SelectValue placeholder="Select your store type" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeTypeOptions.map((option) => (
                        <SelectItem key={option.uuid} value={option.uuid}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedStoreType && selectedStoreType.onboarding_category_set ? (
            <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {selectedStoreType.name}
              </p>
              {selectedStoreType.description ? (
                <p className="mt-1">{selectedStoreType.description}</p>
              ) : null}
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Assigned starter categories
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {starterCategories.map((category) => (
                  <li
                    key={category.uuid}
                    className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 shadow-sm ring-1 ring-slate-200"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-md border border-dashed bg-slate-50 p-4 text-sm text-slate-600">
              {storeTypeOptions.length === 0
                ? "Store types are being configured. Please ask an administrator to prepare onboarding defaults."
                : "Select a store type to preview the starter categories your store will receive."}
            </div>
          )}
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-lg font-bold">Name</FormLabel>
                <FormDescription className="text-xs">
                  give a unique legal name
                </FormDescription>
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
                <FormLabel className="text-lg font-bold">Email</FormLabel>
                <FormDescription className="text-xs">
                  give your store email
                </FormDescription>
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
                <FormLabel className="text-lg font-bold">Phone</FormLabel>
                <FormDescription className="text-xs">
                  give a store phone number.
                </FormDescription>
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
          <ThemedButton
            className={cn(`text-md w-full cursor-pointer py-6`)}
            disabled={form.formState.isSubmitting || storeTypeOptions.length === 0}
          >
            Submit
          </ThemedButton>
        </form>
      </Form>
    </div>
  );
};

export default SetBusinessAndEmail;
