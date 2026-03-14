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
import {
  StoreTypeIndexPayloadSchema,
  StoreTypeOptionSchema,
} from "@/modules/vendor/domain/schemas/storeOnboarding";
import { formattedIssues } from "@/modules/core/utils/zod.util";
import { actionGetCategories } from "@/modules/product.management/actions/category";
import { z } from "zod";

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

    const response = await instance.get("vendor/store-types");
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

export const actionGetAdminStoreOnboardingStoreTypes = async () => {
  try {
    const instance = await authAxiosInstance();
    const response = await instance.get("vendor/admin/store-onboarding/store-types");
    const parsed = ApiResponseSchema(StoreTypeIndexPayloadSchema).safeParse(
      response.data,
    );

    if (!parsed.success) {
      throw new Error("Admin store onboarding schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      throw new Error(
        typeof parsed.data.metaData.error === "string"
          ? parsed.data.metaData.error
          : "Unable to load onboarding store types.",
      );
    }

    return parsed.data.data.payload.store_types;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const actionUpdateAdminStoreOnboardingSet = async ({
  storeTypeUuid,
  name,
  description,
  categoryUuids,
}: {
  storeTypeUuid: string;
  name?: string;
  description?: string | null;
  categoryUuids: string[];
}) => {
  try {
    const instance = await authAxiosInstance();
    const response = await instance.put(
      `vendor/admin/store-onboarding/store-types/${storeTypeUuid}`,
      {
        name,
        description,
        category_uuids: categoryUuids,
      },
    );
    const parsed = ApiResponseSchema(
      z.object({
        store_type: StoreTypeOptionSchema,
      }),
    ).safeParse(response.data);

    if (!parsed.success) {
      throw new Error("Admin onboarding update schema validation failed.");
    }

    if (parsed.data.metaData.error || parsed.data.data.payload === null) {
      throw new Error(
        typeof parsed.data.metaData.error === "string"
          ? parsed.data.metaData.error
          : "Unable to update onboarding set.",
      );
    }

    return parsed.data.data.payload.store_type;
  } catch (error) {
    return handleRemoteError(error);
  }
};

export const actionGetAdminLeafCategories = async () => {
  return actionGetCategories({
    filter: { leafOnly: true },
    perPage: "500",
    sort: "name",
  });
};
