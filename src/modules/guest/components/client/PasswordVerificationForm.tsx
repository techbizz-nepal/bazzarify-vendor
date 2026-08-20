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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import FormTitle from "@/modules/core/components/server/FormTitle";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { Path, UseFormReturn } from "react-hook-form";

type PasswordVerificationFields = {
  phone: string;
  otp: string;
  password: string;
  password_confirmation: string;
};

interface PasswordVerificationFormProps<T extends PasswordVerificationFields> {
  className?: string;
  formTitle: string;
  formHelpText: string;
  buttonLabel: string;
  onSubmitAction: (data: T) => void;
  form: UseFormReturn<T>;
  backHref: string;
  backLabel: string;
  phoneInputMode?: "editable" | "readonly";
  phoneDisplayText?: string;
}

export default function PasswordVerificationForm<
  T extends PasswordVerificationFields,
>({
  className,
  formTitle,
  formHelpText,
  buttonLabel,
  onSubmitAction,
  form,
  backHref,
  backLabel,
  phoneInputMode = "editable",
  phoneDisplayText,
}: PasswordVerificationFormProps<T>) {
  const isPhoneReadonly = phoneInputMode === "readonly";
  const showPhoneDisplay = isPhoneReadonly && !!phoneDisplayText;

  return (
    <div className={className}>
      <FormTitle
        label={formTitle}
        helpText={formHelpText}
        className="flex w-full items-center justify-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitAction)}
          className="flex-col space-y-6"
        >
          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">Phone</FormLabel>
                <FormControl>
                  {showPhoneDisplay ? (
                    <div className="flex items-center gap-x-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="text-sm font-medium tracking-widest text-slate-700">
                        {phoneDisplayText}
                      </span>
                      <input type="hidden" {...field} />
                    </div>
                  ) : (
                    <Input
                      autoComplete="mobile tel"
                      className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                      type="number"
                      placeholder="Enter phone"
                      readOnly={isPhoneReadonly}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"phone" as Path<T>}
          />

          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormControl>
                  <InputOTP
                    autoComplete=""
                    pattern={REGEXP_ONLY_DIGITS}
                    containerClassName="flex w-full items-center justify-center"
                    maxLength={6}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot className="h-12 w-14" index={0} />
                      <InputOTPSlot className="h-12 w-14" index={1} />
                      <InputOTPSlot className="h-12 w-14" index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="h-12 w-14" index={3} />
                      <InputOTPSlot className="h-12 w-14" index={4} />
                      <InputOTPSlot className="h-12 w-14" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"otp" as Path<T>}
          />
          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"password" as Path<T>}
          />
          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name={"password_confirmation" as Path<T>}
          />
          <ThemedButton
            disabled={form.formState.isSubmitting}
            className="text-md w-full cursor-pointer py-6"
            type="submit"
          >
            {buttonLabel}
          </ThemedButton>
          <Link
            className="text-md bg-foreground text-primary-foreground flex w-full cursor-pointer items-center justify-center rounded-md py-3"
            href={backHref}
          >
            {backLabel}
          </Link>
        </form>
      </Form>
    </div>
  );
}
