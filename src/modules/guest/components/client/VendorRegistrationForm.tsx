"use client";

import {useRouter, useSearchParams} from "next/navigation";
import useSession from "@/modules/core/hooks/useSession";
import useVendorRegistration from "@/modules/guest/hooks/useVendorRegistration";
import Banner from "@/modules/guest/components/client/registration/Banner";
import OTPVerificationRequestForm from "@/modules/guest/components/client/registration/OTPVerificationRequestForm";
import VerifyOTPForm from "@/modules/guest/components/client/VerifyOTPForm";
import SetBusinessAndEmailForm from "@/modules/guest/components/client/registration/SetBusinessAndEmailForm";

export default function VendorRegistrationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {toggleSession} = useSession(router);
    const {
        otpRequestForm,
        verifyOTPForm,
        businessAndEmailForm,
        handleOTPRequestSubmit,
        handleOTPVerificationSubmit,
        handleSetBusinessAndEmailSubmit
    } = useVendorRegistration(
        router,
        toggleSession,
    );
    return (
        <>
            <Banner>
                {searchParams.size == 0 && (
                    <OTPVerificationRequestForm
                        form={otpRequestForm}
                        onSubmit={handleOTPRequestSubmit}
                    />
                )}
                {searchParams.has("phone") && (
                    <VerifyOTPForm
                        form={verifyOTPForm}
                        onSubmitAction={handleOTPVerificationSubmit}
                        buttonLabel="Next"
                        formHelpText="Enter the 6 digit code sent"
                        formTitle="Enter the code"
                        className="flex flex-col space-y-7"
                    />
                )}
                {searchParams.has("verified") &&
                    <SetBusinessAndEmailForm
                        form={businessAndEmailForm}
                        onSubmit={handleSetBusinessAndEmailSubmit}
                    />}
            </Banner>
        </>
    );
}
