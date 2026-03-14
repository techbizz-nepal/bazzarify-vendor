"use server";

import {
  getAuthUser,
  getSessionUserUUID,
  setAuthUser,
} from "@/modules/auth/data/lib/auth-lib";
import StoreCreatePayloadSchema from "@/modules/auth/domain/schemas/payloads/StoreCreatePayloadSchema";
import ApiResponseSchema from "@/modules/core/domain/schemas/ApiResponse";
import { handleRemoteError } from "@/modules/core/lib/utils.index";
import { getCookieStore } from "@/modules/core/lib/utils.session";
import { authAxiosInstance } from "@/modules/core/lib/utils.axios";
import postDataAndValidate from "@/modules/core/utils/postDataAndValidate";
import { BusinessAndEmailFormValues } from "@/modules/guest/config/schemas/set.business.email.form";
import { StoreTypeIndexPayloadSchema } from "@/modules/vendor/domain/schemas/storeOnboarding";
import { formattedIssues } from "@/modules/core/utils/zod.util";

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

export const actionGetStoreTypeOptions = async () => {
  try {
    const instance = await authAxiosInstance();
    if (!instance) {
      throw new Error("Authentication error.");
    }

    const response = await instance.get("vendor/v1/store-types");
    const parsed = ApiResponseSchema(StoreTypeIndexPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      console.log(
        "schema validation error on store type options:",
        formattedIssues(parsed.error.issues),
      );
      throw new Error("Store type options schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      throw new Error(
        typeof parsed.data.metaData.error === "string"
          ? parsed.data.metaData.error
          : "Unable to load store type options.",
      );
    }

    return parsed.data.data.payload.store_types;
  } catch (error) {
    console.error(error);
    return [];
  }
};
