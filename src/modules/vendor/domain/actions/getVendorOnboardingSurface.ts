"use server";

import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import { handleUnknownError } from "@/modules/core/lib/utils.index";
import {
  VendorOnboardingSurfacePayloadSchema,
  type TVendorOnboardingSurface,
} from "@/modules/vendor/domain/schemas/onboarding-surface";
import { isAxiosError } from "axios";

export type VendorOnboardingSurfaceResult =
  | TVendorOnboardingSurface
  | { error: string; errorCode?: number };

export const actionGetVendorOnboardingSurface =
  async (): Promise<VendorOnboardingSurfaceResult> => {
    try {
      const client = await authAxiosInstance();
      const response = await client.get("/vendor/onboarding/surface");
      const parsed = ApiResponseSchema(
        VendorOnboardingSurfacePayloadSchema,
      ).safeParse(response.data);

      if (!parsed.success) {
        console.log(
          "[vendor-onboarding-surface] schema validation failed",
          parsed.error.issues,
        );
        return { error: "Vendor onboarding surface schema validation failed." };
      }

      if (parsed.data.metaData.error || parsed.data.data.payload === null) {
        return {
          error:
            typeof parsed.data.metaData.error === "string"
              ? parsed.data.metaData.error
              : "Unable to load vendor onboarding surface.",
          errorCode: parsed.data.metaData.errorCode ?? undefined,
        };
      }

      return parsed.data.data.payload.surface;
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(
          "error fetch vendor onboarding surface: ",
          error?.response?.data,
        );
      } else {
        console.log("error fetch vendor onboarding surface: ", error);
      }
      return handleUnknownError(error) as { error: string; errorCode?: number };
    }
  };
