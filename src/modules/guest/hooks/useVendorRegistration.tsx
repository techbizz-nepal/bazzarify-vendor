import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseSyntheticEvent } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  RegistrationVerificationFormSchema,
  RegistrationVerificationFormValues,
} from "@/modules/guest/config/schemas/registrationVerificationForm";
import { actionSetBusinessAndEmail } from "@/modules/guest/actions/auth";
import {
  BusinessAndEmailFormValues,
  SetBusinessAndEmailSchema,
} from "@/modules/guest/config/schemas/set.business.email.form";
import {
  RegistrationRequestFormSchema,
  RegistrationRequestFormValues,
} from "@/modules/guest/config/schemas/registrationRequestForm";
import {
  actionRequestRegistration,
  actionVerifyRegistration,
} from "@/modules/guest/actions/register";
import { ReadonlyURLSearchParams } from "next/navigation";

export default function useVendorRegistration(
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams,
  toggleSession: () => void,
) {
  const registrationRequestForm = useForm<RegistrationRequestFormValues>({
    resolver: zodResolver(RegistrationRequestFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const registrationRequestVerificationForm =
    useForm<RegistrationVerificationFormValues>({
      resolver: zodResolver(RegistrationVerificationFormSchema),
      defaultValues: {
        phone: searchParams.get("phone") || "",
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

  const handleRequestRegistration = (
    data: RegistrationRequestFormValues,
    e: BaseSyntheticEvent | undefined,
  ) => {
    if (!(e?.nativeEvent instanceof SubmitEvent)) return;
    const submitter = e.nativeEvent.submitter as HTMLButtonElement;
    const channel: string = submitter.value;
    actionRequestRegistration({ ...data, channel })
      .then((res) => {
        if (res.data.message != "success") {
          return alert("Something went wrong!");
        }
        router.push("/register?phone=".concat(data.phone));
      })
      .catch(() => alert("Something went wrong!"));
  };

  const handleRegistrationVerification = (
    data: RegistrationVerificationFormValues,
  ) => {
    const phone = searchParams.get("phone");
    if (!phone) return alert("Invalid request");
    actionVerifyRegistration(data)
      .then((res) => {
        console.log(res);
        if (res.data.message != "success") {
          return alert("Something went wrong!");
        }
        // router.push("/register?verified=true");
      })
      .catch((err) => console.log(err));
  };

  const handleSetBusinessAndEmailSubmit = (data: BusinessAndEmailFormValues) =>
    actionSetBusinessAndEmail(data)
      .then(() => {
        toggleSession();
      })
      .catch((error) => console.log(error));
  return {
    registrationRequestForm,
    registrationRequestVerificationForm,
    businessAndEmailForm,
    handleRequestRegistration,
    handleRegistrationVerification,
    handleSetBusinessAndEmailSubmit,
  };
}
