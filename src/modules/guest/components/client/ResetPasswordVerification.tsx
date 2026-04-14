"use client";

import PasswordVerificationForm from "@/modules/guest/components/client/PasswordVerificationForm";
import { usePasswordResetVerificationFlow } from "@/modules/guest/hooks/usePasswordResetFlow";

function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return "•".repeat(phone.length - 4) + phone.slice(-4);
}

export default function ResetPasswordVerification({
  phone,
}: {
  phone: string;
}) {
  const { form, handlePasswordResetVerification } =
    usePasswordResetVerificationFlow({ phone });

  const maskedPhone = maskPhone(phone);

  return (
    <div className="flex w-11/12 md:w-6/12 flex-col space-y-6 rounded-md bg-white p-16">
      <PasswordVerificationForm
        form={form}
        onSubmitAction={handlePasswordResetVerification}
        buttonLabel="Reset Password"
        formHelpText={`If your details matched our records, a reset code was sent to the number ending in ${phone.slice(-4)}. Didn't receive it? Go back and verify your email and phone.`}
        formTitle="Check your phone"
        className="flex flex-col space-y-7"
        backHref="/reset-password"
        backLabel="Go back and verify your details"
        phoneInputMode="readonly"
        phoneDisplayText={maskedPhone}
      />
    </div>
  );
}
