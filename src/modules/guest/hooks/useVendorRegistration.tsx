import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OTPRequestFormSchema,
  OTPRequestFormValues,
} from "@/modules/guest/config/schemas/otp.request.form";
import { BaseSyntheticEvent } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  VerifyOtpFormSchema,
  VerifyOtpFormValues,
} from "@/modules/guest/config/schemas/verify.otp.form";
import {
  actionOTPRequest,
  actionOTPVerificationWithNewPassword,
  actionSetBusinessAndEmail,
} from "@/modules/guest/actions/auth";
import {
  BusinessAndEmailFormValues,
  SetBusinessAndEmailSchema,
} from "@/modules/guest/config/schemas/set.business.email.form";

export default function useVendorRegistration(
  router: AppRouterInstance,
  toggleSession: () => void,
) {
  const otpRequestForm = useForm<OTPRequestFormValues>({
    resolver: zodResolver(OTPRequestFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const verifyOTPForm = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(VerifyOtpFormSchema),
    defaultValues: {
      otp: undefined,
      password: "",
      password_confirmation: "",
    },
  });

  const businessAndEmailForm = useForm({
    resolver: zodResolver(SetBusinessAndEmailSchema),
    defaultValues: {
      email: "",
      business_name: "",
    },
  });

  const handleOTPRequestSubmit = (
    data: OTPRequestFormValues,
    e: BaseSyntheticEvent | undefined,
  ) => {
    if (!(e?.nativeEvent instanceof SubmitEvent)) return;
    const submitter = e.nativeEvent.submitter as HTMLButtonElement;
    const channel: string = submitter.value;
    actionOTPRequest({ ...data, channel }).then(() =>
      router.push("/register?phone=".concat(data.phone)),
    );
  };

  const handleOTPVerificationSubmit = (data: VerifyOtpFormValues) => {
    actionOTPVerificationWithNewPassword(data)
      .then(() => router.push("/register?verified=true"))
      .catch((err) => console.log(err));
  };

  const handleSetBusinessAndEmailSubmit = (data: BusinessAndEmailFormValues) =>
    actionSetBusinessAndEmail(data)
      .then(() => {
        toggleSession();
      })
      .catch((error) => console.log(error));
  return {
    otpRequestForm,
    verifyOTPForm,
    businessAndEmailForm,
    handleOTPRequestSubmit,
    handleOTPVerificationSubmit,
    handleSetBusinessAndEmailSubmit,
  };
}
