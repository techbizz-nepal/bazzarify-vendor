import { UseFormReturn } from "react-hook-form";
import FormTitle from "@/modules/core/components/server/FormTitle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { BaseSyntheticEvent } from "react";
import { BusinessAndEmailFormValues } from "@/modules/guest/config/schemas/set.business.email.form";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

interface ISetBusinessAndEmailForm {
  form: UseFormReturn<{
    business_name: string;
    email: string;
  }>;
  onSubmit: (
    data: BusinessAndEmailFormValues,
    e: BaseSyntheticEvent | undefined,
  ) => void;
}

const SetBusinessAndEmail = ({ form, onSubmit }: ISetBusinessAndEmailForm) => (
  <>
    <FormTitle
      label="Set Business and Email"
      className="flex w-full items-center"
    />
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
                  className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
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
                  className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
                  placeholder="Enter your business email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ThemedButton className={cn(`w-full text-md py-6 cursor-pointer`)}>
          Submit
        </ThemedButton>
      </form>
    </Form>
  </>
);

export default SetBusinessAndEmail;
