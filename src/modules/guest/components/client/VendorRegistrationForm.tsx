"use client";

import Banner from "@/modules/guest/components/client/registration/Banner";
import PasswordVerificationForm from "@/modules/guest/components/client/PasswordVerificationForm";
import RegistrationRequest from "@/modules/guest/components/client/registration/RegistrationRequest";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import { useRouter } from "next/navigation";

export default function VendorRegistrationForm() {
  const router = useRouter();

  const {
    registrationRequestForm,
    registrationRequestVerificationForm,
    handleRequestRegistration,
    handleRegistrationVerification,
    requestVerificationPhone,
  } = useVendorRegistration(router);
  return (
    <>
      <Banner>
        {!registrationRequestForm.getValues("phone") && (
          <RegistrationRequest
            form={registrationRequestForm}
            onSubmit={handleRequestRegistration}
          />
        )}
        {requestVerificationPhone &&
          !registrationRequestVerificationForm?.getValues("verified") && (
            <PasswordVerificationForm
              form={registrationRequestVerificationForm}
              onSubmitAction={handleRegistrationVerification}
              buttonLabel="Next"
              formHelpText="Enter the 6 digit code sent"
              formTitle="Enter the code"
              className="flex flex-col space-y-7"
              backHref="/register"
              backLabel="Back"
            />
          )}
      </Banner>
    </>
  );
}
