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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import FormTitle from "@/modules/core/components/server/FormTitle";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import {
  ResetPasswordFormSchema,
  ResetPasswordFormValues,
} from "@/modules/guest/config/schemas/reset.password.form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm() {
  const router = useRouter();
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("Session must be used within a SessionContextProvider");
  }
  const { session } = sessionCtx;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);
  const handleSubmit = (data: ResetPasswordFormValues) => {
    // actionResetPassword({
    //   ...data,
    //   phone: phoneWithPrefix,
    // })
    //   .then((response: ResponseDTO) => {
    //     if (response.metaData.error) {
    //       toast.error(response.metaData.error, {
    //         style: {
    //           color: "white",
    //           backgroundColor: "red",
    //         },
    //       });
    //     }
    //     toast("redirecting to otp");
    //     router.replace("/verify-otp?phone=" + phoneWithPrefix);
    //   })
    //   .catch((e) => console.error(e));
    router.replace("/verify-otp?phone=" + data.phone);
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
                <FormLabel className="text-slate-500">Email</FormLabel>
                <FormControl>
                  <Input
                    className="border border-slate-300 placeholder:text-slate-400"
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="email"
          />
          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">Phone</FormLabel>
                <FormControl>
                  <Input
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
            className={cn(
              "text-md w-full py-6",
              form.formState.isSubmitting ? "animate-pulse" : undefined,
            )}
          >
            Reset Password
          </ThemedButton>
        </form>
      </Form>
      <Separator />
      <Link
        href="/login"
        className="text-md border-muted flex w-full items-center justify-center border py-3"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
