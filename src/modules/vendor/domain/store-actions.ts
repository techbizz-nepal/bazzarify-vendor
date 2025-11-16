"use server";

import StoreCreatePayloadSchema from "@/modules/auth/domain/schemas/payloads/StoreCreatePayloadSchema";
import { TSessionUser } from "@/modules/auth/domain/schemas/UserSchema";
import {
  getSessionPayload,
  updateSessionWithUser,
} from "@/modules/core/lib/utils.session";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";
import postDataAndValidate from "@/modules/core/utils/postDataAndValidate";
import { BusinessAndEmailFormValues } from "@/modules/guest/config/schemas/set.business.email.form";

export const actionSetBusinessAndEmail = async (
  data: BusinessAndEmailFormValues,
) => {
  try {
    const sessionPayload = await getSessionPayload();
    if (!sessionPayload) {
      throw new Error("Session does not exist");
    }

    const response = await postDataAndValidate(
      { module: "vendor", path: `vendor/${sessionPayload.uuid}/stores` },
      data,
      StoreCreatePayloadSchema,
      "Unable to create store.",
    );
    const sessionUser = {
      ...sessionPayload,
      store: response.store,
    } as TSessionUser;
    await updateSessionWithUser(sessionUser);
    return response.store;
  } catch (e) {
    return handleError(e);
  }
};
