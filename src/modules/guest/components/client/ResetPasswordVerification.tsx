"use client";

import PasswordVerificationForm from "@/modules/guest/components/client/PasswordVerificationForm";
import { usePasswordResetVerificationFlow } from "@/modules/guest/hooks/usePasswordResetFlow";
import { useRouter } from "next/navigation";

export default function ResetPasswordVerification({
  phone,
}: {
  phone: string;
}) {
  const router = useRouter();
  const { form, handlePasswordResetVerification } =
    usePasswordResetVerificationFlow({
      router,
      phone,
    });

  return (
    <div className="flex w-11/12 md:w-6/12 flex-col space-y-6 rounded-md bg-white p-16">
      <PasswordVerificationForm
        form={form}
        onSubmitAction={handlePasswordResetVerification}
        buttonLabel="Reset Password"
        formHelpText="Enter the 6 digit code sent to your registered phone"
        formTitle="Verify reset code"
        className="flex flex-col space-y-7"
        backHref="/reset-password"
        backLabel="Back to reset request"
        phoneInputMode="readonly"
      />
    </div>
  );
}
