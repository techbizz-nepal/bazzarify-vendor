import VerifyOTPForm from "@/modules/guest/components/client/VerifyOTPForm";
import { handlePasswordResetVerification } from "@/modules/guest/actions/auth";

export default function Page() {
  return (
    <div className="w-full h-screen bg-slate-200 flex flex-col justify-center items-center">
      <VerifyOTPForm
        onSubmitAction={handlePasswordResetVerification}
        buttonLabel="Update Password"
        formTitle="Password Reset"
        formHelpText="We Will Help You Reset your Password"
        className="flex w-4/12 flex-col space-y-6 rounded-md bg-white p-16"
      />
    </div>
  );
}
