import { UseFormReturn } from "react-hook-form";
import { OTPRequestFormValues } from "@/modules/guest/config/schemas/otp.request.form";
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
import { OTPChannel } from "@/modules/guest/data/OTPChannel";
import { CgSpinner, CgSpinnerTwo } from "react-icons/cg";
import { ImSpinner3 } from "react-icons/im";
import { cn } from "@/lib/utils";

interface IOTPVerificationRequestForm {
  form: UseFormReturn<{
    phone: string;
  }>;
  onSubmit: (data: OTPRequestFormValues, e: any) => void;
}

const OTPVerificationRequestForm = ({
  form,
  onSubmit,
}: IOTPVerificationRequestForm) => (
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
          value={OTPChannel.whatsapp.value}
          name="channel"
          className={cn(`w-full text-md py-6`)}
        >
          Send OTP via Whatsapp
        </Button>
        <Button
          name="channel"
          value={OTPChannel.sms.value}
          className="w-full text-md py-6 bg-transparent border border-primary text-primary hover:text-white"
        >
          Verify with SMS
        </Button>
      </form>
    </Form>
  </>
);

export default OTPVerificationRequestForm;
