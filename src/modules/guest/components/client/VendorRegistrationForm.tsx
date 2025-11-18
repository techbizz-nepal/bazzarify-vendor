"use client";

import Banner from "@/modules/guest/components/client/registration/Banner";
import RegistrationRequest from "@/modules/guest/components/client/registration/RegistrationRequest";
import RegistrationVerification from "@/modules/guest/components/client/registration/RegistrationVerification";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import { useRouter } from "next/navigation";

export default function VendorRegistrationForm() {
  const router = useRouter();

  const {
    registrationRequestForm,
    registrationRequestVerificationForm,
    handleRequestRegistration,
    handleRegistrationVerification,
    registrationPhone,
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
        {registrationPhone &&
          !registrationRequestVerificationForm?.getValues("verified") && (
            <RegistrationVerification
              form={registrationRequestVerificationForm}
              onSubmitAction={handleRegistrationVerification}
              buttonLabel="Next"
              formHelpText="Enter the 6 digit code sent"
              formTitle="Enter the code"
              className="flex flex-col space-y-7"
            />
          )}
      </Banner>
    </>
  );
}
