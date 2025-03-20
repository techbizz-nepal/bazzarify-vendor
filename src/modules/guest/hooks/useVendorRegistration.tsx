import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OTPRequestFormSchema,
  OTPRequestFormValues,
} from "@/modules/guest/config/schemas/otp.request.form";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function useVendorRegistration(
  setStep: Dispatch<SetStateAction<number>>,
  router: AppRouterInstance,
) {
  const [formData, setFormData] = useState({ phone: "", channel: "whatsapp" });
  const form = useForm<OTPRequestFormValues>({
    resolver: zodResolver(OTPRequestFormSchema),
    defaultValues: {
      phone: "9851040576",
    },
  });

  const handleOTPRequestSubmit = (
    data: OTPRequestFormValues,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    if (!(e.nativeEvent instanceof SubmitEvent)) return;
    const submitter = e?.nativeEvent?.submitter as HTMLButtonElement;
    const channel: string = submitter.value;
    setFormData((prevState) => ({ ...prevState, ...data, channel }));
    router.push("/register?phone=".concat(data.phone));
    /**
     * send api request for otp request
     */
    // return new Promise((resolve) =>
    //   resolve(
    //     setTimeout(() => {
    //       setStep(2);
    //     }, 5000),
    //   ),
    // );
  };
  return {
    form,
    handleOTPRequestSubmit,
    formData,
  };
}
