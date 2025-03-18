"use client";

import { useForm } from "react-hook-form";
import {
  VerifyOtpFormSchema,
  VerifyOtpFormValues,
} from "@/modules/guest/config/schemas/verify.otp.form";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";

export default function VerifyOTPForm() {
  const router = useRouter();
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("ThemeSwitcher must be used within a ThemeProvider");
  }
  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyOtpFormSchema),
    defaultValues: {
      otp: undefined,
      password: "",
      password_confirmation: "",
    },
  });
  const { session } = sessionCtx;
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);
  const handleSubmit = (data: VerifyOtpFormValues) => {
    console.log(data);
    toast.success("VerifyOTP form successfully!");
    setTimeout(() => router.replace("/login"), 5000);
  };
  return (
    <div className="flex w-4/12 flex-col space-y-6 rounded-md bg-white p-16">
      <FormTitle
        label="Password Reset"
        helpText="We Will Help You Reset your Password"
        className="flex w-full items-center justify-center"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-col space-y-6"
        >
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
          <Button
            className={cn(
              "w-full text-md py-6",
              form.formState.isSubmitting ? "animate-pulse" : undefined,
            )}
          >
            Update Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
