import { errorOptions } from "@/modules/core/constants/toast";
import { SessionContext } from "@/modules/core/contexts/SessionContextProvider";
import {
  actionRequestRegistration,
  actionVerifyRegistration,
} from "@/modules/guest/actions/register";
import {
  RegistrationRequestFormSchema,
  RegistrationRequestFormValues,
} from "@/modules/guest/config/schemas/registrationRequestForm";
import {
  RegistrationVerificationFormSchema,
  RegistrationVerificationFormValues,
} from "@/modules/guest/config/schemas/registrationVerificationForm";
import {
  BusinessAndEmailFormValues,
  SetBusinessAndEmailSchema,
} from "@/modules/guest/config/schemas/set.business.email.form";
import { actionSetBusinessAndEmail } from "@/modules/vendor/domain/store-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { BaseSyntheticEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function useVendorRegistration(router: AppRouterInstance) {
  const sessionCtx = use(SessionContext);
  if (!sessionCtx) {
    throw new Error("SessionProvider must be used in correct place.");
  }
  const { session } = sessionCtx;
  useEffect(() => {
    if (session) {
      return router.replace("/");
    }
  }, [router, session]);
  const [requestVerificationPhone, setRegistrationPhone] = useState("");
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
        phone: requestVerificationPhone,
        otp: undefined,
        password: "",
        password_confirmation: "",
        verified: false,
      },
    });

  const businessAndEmailForm = useForm({
    resolver: zodResolver(SetBusinessAndEmailSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
    },
  });
  const handleRequestRegistration = (
    data: RegistrationRequestFormValues,
    e: BaseSyntheticEvent | undefined,
  ) => {
    e?.preventDefault();
    if (!(e?.nativeEvent instanceof SubmitEvent)) return;
    const submitter = e.nativeEvent.submitter as HTMLButtonElement;
    const channel: string = submitter.value;
    actionRequestRegistration({ ...data, channel })
      .then((res) => {
        if (res.data.message !== "success") {
          // registrationRequestForm.reset();
          console.log("response request registration: ", res.metaData.error);
          // return toast.error(res.metaData.error);
          return toast(res.metaData.error || "Unknown error", errorOptions);
        }
        setRegistrationPhone(registrationRequestForm.getValues("phone"));
        registrationRequestVerificationForm.setValue(
          "phone",
          registrationRequestForm.getValues("phone"),
        );
      })
      .catch((e) => {
        console.log("recvd :", e);
        toast.error("Something went wrong on registration action!");
      });
  };

  const handleRegistrationVerification = (
    data: RegistrationVerificationFormValues,
  ) => {
    const phone = registrationRequestVerificationForm.getValues("phone");
    if (!phone) return alert("Invalid request");
    actionVerifyRegistration(data)
      .then((res) => {
        if (res?.metaData?.error) {
          toast.warning(res?.metaData?.error);
          return;
        }
        toast.success("Signing you in...");
      })
      .catch((err) => console.log(err));
  };

  const handleSetBusinessAndEmailSubmit = (data: BusinessAndEmailFormValues) =>
    actionSetBusinessAndEmail(data)
      .then((r) => {
        if ("metaData" in r && r?.metaData?.error) {
          toast.error(r?.metaData?.error);
          return;
        }
        r !== undefined && r !== null && router.replace("/");
      })
      .catch((error) => console.log(error));
  return {
    registrationRequestForm,
    registrationRequestVerificationForm,
    businessAndEmailForm,
    requestVerificationPhone,
    handleRequestRegistration,
    handleRegistrationVerification,
    handleSetBusinessAndEmailSubmit,
  };
}
