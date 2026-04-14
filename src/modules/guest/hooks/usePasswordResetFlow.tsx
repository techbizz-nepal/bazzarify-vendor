"use client";

import {
  applyValidationFeedback,
  getValidationFeedback,
} from "@/modules/core/lib/utils.validationFeedback";
import {
  actionRequestPasswordReset,
  actionVerifyPasswordReset,
} from "@/modules/guest/actions/auth";
import {
  ResetPasswordFormSchema,
  ResetPasswordFormValues,
} from "@/modules/guest/config/schemas/reset.password.form";
import {
  ResetPasswordVerificationFormSchema,
  ResetPasswordVerificationFormValues,
} from "@/modules/guest/config/schemas/reset.password.verification.form";
import { buildPasswordResetVerificationHref } from "@/modules/guest/utils/passwordReset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const getMessageText = (response: unknown, fallback: string) => {
  if (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    typeof response.data === "object" &&
    response.data !== null &&
    "payload" in response.data &&
    typeof response.data.payload === "object" &&
    response.data.payload !== null &&
    "messageText" in response.data.payload &&
    typeof response.data.payload.messageText === "string"
  ) {
    return response.data.payload.messageText;
  }

  return fallback;
};

export function usePasswordResetRequestFlow() {
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const handleRequestPasswordReset = (data: ResetPasswordFormValues) => {
    toast.info("Sending reset code...");

    actionRequestPasswordReset(data)
      .then((response) => {
        if (response?.metaData?.error) {
          const feedback = getValidationFeedback(response);
          if (feedback) {
            applyValidationFeedback(form.setError, feedback);
            toast.error(feedback.summary);
            return;
          }

          toast.error(response.metaData.error);
          return;
        }

        toast.success(
          getMessageText(
            response,
            "If the account details match our records, a reset code has been sent.",
          ),
        );
        router.push(buildPasswordResetVerificationHref(data.phone));
      })
      .catch((error) => {
        const feedback = getValidationFeedback(error);
        if (feedback) {
          applyValidationFeedback(form.setError, feedback);
          toast.error(feedback.summary);
          return;
        }

        toast.error("Unable to request a reset right now.");
      });
  };

  return {
    form,
    handleRequestPasswordReset,
  };
}

export function usePasswordResetVerificationFlow({
  phone,
}: {
  phone: string;
}) {
  const router = useRouter();
  const form = useForm<ResetPasswordVerificationFormValues>({
    resolver: zodResolver(ResetPasswordVerificationFormSchema),
    defaultValues: {
      phone,
      otp: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    form.setValue("phone", phone);
  }, [form, phone]);

  const handlePasswordResetVerification = (
    data: ResetPasswordVerificationFormValues,
  ) => {
    toast.info("Updating password...");

    actionVerifyPasswordReset(data)
      .then((response) => {
        if (response?.metaData?.error) {
          const feedback = getValidationFeedback(response);
          if (feedback) {
            applyValidationFeedback(form.setError, feedback);
            toast.error(feedback.summary);
            return;
          }

          toast.error(response.metaData.error);
          return;
        }

        toast.success(
          getMessageText(
            response,
            "Password reset successful. Please sign in with your new password.",
          ),
        );
        router.replace("/login");
      })
      .catch((error) => {
        const feedback = getValidationFeedback(error);
        if (feedback) {
          applyValidationFeedback(form.setError, feedback);
          toast.error(feedback.summary);
          return;
        }

        toast.error("Unable to reset your password right now.");
      });
  };

  return {
    form,
    handlePasswordResetVerification,
  };
}
