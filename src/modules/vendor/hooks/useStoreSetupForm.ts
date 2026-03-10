"use client";

import { actionSetBusinessAndEmail } from "@/modules/vendor/domain/store-actions";
import { sanitizeVendorReturnPath } from "@/modules/vendor/domain/storeRequirementNavigation";
import {
  BusinessAndEmailFormValues,
  SetBusinessAndEmailSchema,
} from "@/modules/guest/config/schemas/set.business.email.form";
import {
  applyValidationFeedback,
  getValidationFeedback,
} from "@/modules/core/lib/utils.validationFeedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UseStoreSetupFormOptions {
  redirectTo?: string | null;
}

export default function useStoreSetupForm(
  router: AppRouterInstance,
  options: UseStoreSetupFormOptions = {},
) {
  const redirectTo = sanitizeVendorReturnPath(options.redirectTo);

  const storeSetupForm = useForm<BusinessAndEmailFormValues>({
    resolver: zodResolver(SetBusinessAndEmailSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
    },
  });

  const handleStoreSetupSubmit = (data: BusinessAndEmailFormValues) =>
    actionSetBusinessAndEmail(data)
      .then((response) => {
        if ("metaData" in response && response.metaData?.error) {
          const feedback = getValidationFeedback(response);
          if (feedback) {
            applyValidationFeedback(storeSetupForm.setError, feedback);
            toast.error(feedback.summary);
            return;
          }

          toast.error(response.metaData.error);
          return;
        }

        if (response) {
          toast.success("Store created.");
          router.replace(redirectTo);
        }
      })
      .catch((error) => {
        const feedback = getValidationFeedback(error);
        if (feedback) {
          applyValidationFeedback(storeSetupForm.setError, feedback);
          toast.error(feedback.summary);
          return;
        }

        toast.error("Unable to create store right now.");
      });

  return {
    storeSetupForm,
    handleStoreSetupSubmit,
  };
}
