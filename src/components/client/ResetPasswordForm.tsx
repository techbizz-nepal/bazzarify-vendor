"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTitle from "@/components/common/FormTitle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ResetPasswordFormSchema,
  ResetPasswordFormValues,
} from "@/form.schema/reset.password.form";
import Link from "next/link";
import { actionResetPassword } from "@/modules/auth/actions/auth";
import { cn } from "@/lib/utils";
import { ResponseDTO } from "@/modules/core/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const handleSubmit = (data: ResetPasswordFormValues) => {
    const phoneWithPrefix = !data.phone.includes("+977")
      ? process.env.NEXT_PUBLIC_PHONE_PREFIX
        ? process.env.NEXT_PUBLIC_PHONE_PREFIX.concat(data.phone.trim())
        : data.phone
      : data.phone;
    actionResetPassword({
      ...data,
      phone: phoneWithPrefix,
    })
      .then((response: ResponseDTO) => {
        if (response.metaData.error) {
          toast.error(response.metaData.error, {
            style: {
              color: "white",
              backgroundColor: "red",
            },
          });
        }
        toast("redirecting to otp");
        router.replace("/opt-verify?phone=" + phoneWithPrefix);
      })
      .catch((e) => console.error(e));
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
                    className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
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
          <Button
            className={cn(
              "w-full text-md py-6",
              form.formState.isSubmitting ? "animate-pulse" : undefined,
            )}
          >
            Reset Password
          </Button>
        </form>
      </Form>
      <div className="border border-b-slate-300" />
      <Link
        href="/login"
        className="w-full text-md py-3 border border-muted flex items-center justify-center"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
