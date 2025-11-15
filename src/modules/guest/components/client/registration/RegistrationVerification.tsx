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
import { RegistrationVerificationFormValues } from "@/modules/guest/config/schemas/registrationVerificationForm";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

interface IRegistrationRequestVerification {
  className?: string;
  formTitle: string;
  formHelpText: string;
  buttonLabel: string;
  onSubmitAction: (data: RegistrationVerificationFormValues) => void;
  form: UseFormReturn<RegistrationVerificationFormValues>;
}

export default function RegistrationVerification({
  className,
  formTitle,
  formHelpText,
  buttonLabel,
  onSubmitAction,
  form,
}: IRegistrationRequestVerification) {
  const router = useRouter();
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
          <Input
            type="hidden"
            defaultValue={form.getValues("phone")}
            {...form.register("phone")}
          />

          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormControl>
                  <InputOTP
                    autoComplete={""}
                    pattern={REGEXP_ONLY_DIGITS}
                    containerClassName="flex items-center justify-center w-full"
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
            name="otp"
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
            name="password"
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
            name="password_confirmation"
          />
          <ThemedButton
            className="text-md w-full cursor-pointer py-6"
            type="submit"
          >
            {buttonLabel}
          </ThemedButton>
          <Link
            className="text-md bg-foreground text-primary-foreground flex w-full cursor-pointer items-center justify-center rounded-md py-3"
            href="/register"
          >
            Back
          </Link>
        </form>
      </Form>
    </div>
  );
}
