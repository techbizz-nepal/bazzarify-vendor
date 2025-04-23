"use client";

import { UseFormReturn } from "react-hook-form";
import FormTitle from "@/modules/core/components/server/FormTitle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { use, useEffect, useState } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import Link from "next/link";
import { RegistrationVerificationFormValues } from "@/modules/guest/config/schemas/registrationVerificationForm";
import { phoneRegex } from "@/modules/core/lib/utils.index";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

interface IRegistrationRequestVerification {
  className?: string;
  formTitle: string;
  formHelpText: string;
  buttonLabel: string;
  onSubmitAction: (data: RegistrationVerificationFormValues) => void;
  form: UseFormReturn<{
    phone: string;
    otp: string;
    password: string;
    password_confirmation: string;
  }>;
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
  const urlSearchParams = useSearchParams();
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("SessionProvider must be used in correct place.");
  }
  const { session } = sessionCtx;
  const [phone] = useState<string>(urlSearchParams.get("phone")?.trim() || "");
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
    if (!phone || !phoneRegex.test(phone)) {
      throw new Error("403");
    }
  }, [phone, router, session]);
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
            defaultValue={phone}
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
                      <InputOTPSlot className="w-14 h-12" index={0} />
                      <InputOTPSlot className="w-14 h-12" index={1} />
                      <InputOTPSlot className="w-14 h-12" index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot className="w-14 h-12" index={3} />
                      <InputOTPSlot className="w-14 h-12" index={4} />
                      <InputOTPSlot className="w-14 h-12" index={5} />
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
                    className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
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
                    className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
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
            className="w-full text-md py-6 cursor-pointer"
            type="submit"
          >
            {buttonLabel}
          </ThemedButton>
          <Link
            className="w-full text-md py-3 cursor-pointer bg-foreground text-primary-foreground rounded-md flex items-center justify-center"
            href="/register"
          >
            Back
          </Link>
        </form>
      </Form>
    </div>
  );
}
