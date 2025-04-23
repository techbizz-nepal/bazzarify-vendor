"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTitle from "@/modules/core/components/server/FormTitle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  LoginFormSchema,
  LoginFormValues,
} from "@/modules/guest/config/schemas/login.form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import { actionLogin } from "@/modules/guest/actions/login";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

export default function LoginForm() {
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("SessionProvider must be used in correct place.");
  }
  const { session } = sessionCtx;
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      credential: "9851040576",
      password: "12345678",
    },
  });
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);

  function handleSubmit(data: LoginFormValues) {
    let t = toast("Signing In...");
    actionLogin(data)
      .then(() => {
        toast.dismiss(t);
      })
      .catch(() => {
        toast.dismiss(t);
        t = toast.error("Cannot login");
      })
      .finally(() => {
        toast.dismiss(t);
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
                    className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
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
          <ThemedButton className="w-full text-md py-6">Sign In</ThemedButton>
        </form>
      </Form>
      <Link
        href="/register"
        className="flex items-center justify-center text-secondary-foreground"
      >
        <p>Doesn&apos;t have an account ?</p>
      </Link>
      <Link
        href="/reset-password"
        className="flex items-center justify-center text-secondary-foreground"
      >
        <p>Forgot Password ?</p>
      </Link>
    </div>
  );
}
