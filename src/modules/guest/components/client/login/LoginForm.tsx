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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LoginFormSchema,
  LoginFormValues,
} from "@/modules/guest/config/schemas/login.form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";

export default function LoginForm() {
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("SessionProvider must be used in correct place.");
  }
  const { session, toggleSession } = sessionCtx;
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  console.log("session: ", session);
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);

  function handleSubmit(data: LoginFormValues) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    setTimeout(() => {
      toggleSession();
      router.replace("/");
    }, 3000);
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
                <FormLabel className="text-slate-500">Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete={""}
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
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start ">
                <FormControl>
                  <Checkbox
                    className="border border-slate-400 accent-orange-600"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-slate-600">
                  Keep me signed in
                </FormLabel>
              </FormItem>
            )}
          />
          <Button className="w-full text-md py-6">Sign In</Button>
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
