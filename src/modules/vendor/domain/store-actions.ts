"use server";

import {
  getAuthUser,
  getSessionUserUUID,
  setAuthUser,
} from "@/modules/auth/data/lib/auth-lib";
import StoreCreatePayloadSchema from "@/modules/auth/domain/schemas/payloads/StoreCreatePayloadSchema";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import postDataAndValidate from "@/modules/core/utils/postDataAndValidate";
import { BusinessAndEmailFormValues } from "@/modules/guest/config/schemas/set.business.email.form";

export const actionSetBusinessAndEmail = async (
  data: BusinessAndEmailFormValues,
) => {
  try {
    const userUUID = await getSessionUserUUID(await getCookieStore());
    if (!userUUID) {
      throw new Error("no userUUID on action set business: ");
    }
    const authUserRedis = await getAuthUser(userUUID);
    if ("error" in authUserRedis) {
      const msg = "authUser from redis fail: ";
      console.error(msg, authUserRedis.error);
      throw new Error(msg);
    }

    try {
      const response = await postDataAndValidate(
        { module: "vendor", path: `vendor/${authUserRedis.uuid}/stores` },
        data,
        StoreCreatePayloadSchema,
        "Unable to create store.",
      );
      await setAuthUser(userUUID, {
        ...authUserRedis,
        store: response.store,
      });
      return response.store;
    } catch (e) {
      return handleRemoteError(e);
    }
  } catch (e) {
    return handleRemoteError(e);
  }
};
