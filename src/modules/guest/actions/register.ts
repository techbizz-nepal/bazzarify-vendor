import { defaultAxiosInstance } from "@/modules/core/lib/utils.axios";
import { AUTH_ROUTES } from "@/modules/guest/config/routes";
import { RegistrationRequestFormValues } from "@/modules/guest/config/schemas/registrationRequestForm";
import { RegistrationVerificationFormValues } from "@/modules/guest/config/schemas/registrationVerificationForm";
import { handleRemoteError } from "@/modules/core/lib/utils.index";

export const actionRequestRegistration = async (
  data: RegistrationRequestFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.register.signup.path,
      data,
    );
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};

export const actionVerifyRegistration = async (
  data: RegistrationVerificationFormValues,
) => {
  try {
    const response = await defaultAxiosInstance.post(
      AUTH_ROUTES.register.verifySignup.path,
      data,
    );
    return response.data;
  } catch (error: unknown) {
    return handleRemoteError(error);
  }
};
