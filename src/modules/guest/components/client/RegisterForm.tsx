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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import {
  RegisterFormSchema,
  RegisterFormValues,
} from "@/modules/guest/config/schemas/register.form";

export default function RegisterForm() {
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("ThemeSwitcher must be used within a ThemeProvider");
  }
  const { session, toggleSession } = sessionCtx;
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);

  function handleSubmit(data: RegisterFormValues) {
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
        label="Register"
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
                <FormLabel className="text-slate-500">Full Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete={""}
                    className="border border-slate-300 placeholder:text-slate-400"
                    type="text"
                    placeholder="Enter full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="name"
          />
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
          <FormField
            name="password"
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
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-2">
                <FormLabel className="text-slate-500">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="border border-slate-300 placeholder:text-slate-400 accent-orange-600"
                    type="password"
                    placeholder="Enter confirm password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="w-full text-md py-6">Register</Button>
        </form>
      </Form>
      <Link
        href="/login"
        className="flex items-center justify-center text-secondary-foreground"
      >
        <p>Already have an account ?</p>
      </Link>
    </div>
  );
}
