import { UseFormReturn } from "react-hook-form";
import { RegistrationRequestFormValues } from "@/modules/guest/config/schemas/registrationRequestForm";
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
import { OTPChannel } from "@/modules/guest/data/OTPChannel";
import { cn } from "@/lib/utils";
import React, { BaseSyntheticEvent } from "react";
import { ThemedButton } from "@/modules/core/components/server/ThemedButton";

interface IRegistrationRequest {
  form: UseFormReturn<{
    phone: string;
  }>;
  onSubmit: (
    data: RegistrationRequestFormValues,
    e: BaseSyntheticEvent | undefined,
  ) => void;
}

const RegistrationRequest = ({ form, onSubmit }: IRegistrationRequest) => (
  <>
    <FormTitle
      label="Sign up at Bazzarify"
      helpText="sign up in 2 steps"
      className="flex w-full items-center"
    />
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data, e) => onSubmit(data, e))}
        className="flex-col space-y-6"
      >
        <FormField
          render={({ field }) => (
            <FormItem className="flex flex-col gap-y-2">
              <FormLabel className="text-slate-500">Phone</FormLabel>
              <FormControl>
                <Input
                  autoComplete="mobile tel"
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
        <ThemedButton
          value={OTPChannel.whatsapp.value}
          name="channel"
          className={cn(`w-full text-md py-6 cursor-pointer`)}
        >
          Send OTP via Whatsapp
        </ThemedButton>
        <ThemedButton
          name="channel"
          value={OTPChannel.sms.value}
          className="w-full text-md py-6 bg-transparent border border-primary text-primary hover:text-white cursor-pointer"
        >
          Verify with SMS
        </ThemedButton>
      </form>
    </Form>
  </>
);

export default RegistrationRequest;
