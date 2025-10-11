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
import FormTitle from "@/modules/core/components/server/FormTitle";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";
import { actionLogin } from "@/modules/guest/actions/login";
import {
  LoginFormSchema,
  LoginFormValues,
} from "@/modules/guest/config/schemas/login.form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      credential: "",
      password: "",
    },
  });

  function handleSubmit(data: LoginFormValues) {
    toast.info("Signing In...");
    const loginData =
      process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
        ? {
            ...data,
            credential: "gracysusant@gmail.com",
            password: "H@nds0me1522",
          }
        : { ...data };

    actionLogin(loginData)
      .then((response) => {
        if (response?.metaData?.error) {
          toast.warning(response?.metaData?.error);
          return;
        }
        toast.success("Signing you in...");
      })
      .catch(() => {
        toast.error("Cannot login");
      });
  }

  return (
    <div className="flex w-4/12 flex-col space-y-6 rounded-md bg-white p-16">
      <FormTitle
        label="Sign In"
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
                <FormLabel className="text-slate-500">Email/Phone</FormLabel>
                <FormControl>
                  <Input
                    autoComplete=""
                    className="border border-slate-300 placeholder:text-slate-400"
                    type="text"
                    placeholder="Enter your email/phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="credential"
          />
          <FormField
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">Password</FormLabel>
                <FormControl>
                  <Input
                    className="border border-slate-300 accent-orange-600 placeholder:text-slate-400"
                    type="password"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="password"
          />
          <ThemedButton className="text-md w-full py-6">Sign In</ThemedButton>
        </form>
      </Form>
      <Link
        href="/register"
        className="text-secondary-foreground flex items-center justify-center"
      >
        <p>Doesn&apos;t have an account ?</p>
      </Link>
      <Link
        href="/reset-password"
        className="text-secondary-foreground flex items-center justify-center"
      >
        <p>Forgot Password ?</p>
      </Link>
    </div>
  );
}
