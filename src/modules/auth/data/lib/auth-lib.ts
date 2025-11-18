import { TSessionUser } from "@/modules/auth/domain/schemas/UserSchema";
import {
  deleteRedisValue,
  getRedisValue,
  setRedisValue,
} from "@/modules/core/domain/actions/actionRedis";
import { getSessionDecrypted } from "@/modules/core/lib/utils.session";
import { IApiMetaData } from "@/modules/core/schemas/response";
import { getJsonOrString } from "@/modules/core/utils";
import { handleError } from "@/modules/core/utils/jsonResponse.utils";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getSessionToken(
  store: ReadonlyRequestCookies,
): Promise<string | null> {
  const jwtPayload = await getSessionDecrypted(store);
  if (jwtPayload === null) {
    console.log("no jwt payload getSessionToken: ", jwtPayload);
    return null;
  }
  if (!("token" in jwtPayload)) {
    console.log("no token in jwt payload: ", jwtPayload.token);
    return null;
  }
  return jwtPayload.token as string;
}
export async function getSessionUserUUID(
  store: ReadonlyRequestCookies,
): Promise<string | null> {
  const jwtPayload = await getSessionDecrypted(store);

  if (jwtPayload === null) {
    console.log("no jwt payload getSessionUserUUID: ", jwtPayload);
    return null;
  }
  if (!("userUUID" in jwtPayload)) {
    console.log("no token in jwt payload: ", jwtPayload.token);
    return null;
  }
  return jwtPayload.userUUID as string;
}
export async function getAuthUser(
  token: string,
): Promise<TSessionUser | IApiMetaData> {
  try {
    const value = await getRedisValue(token);
    return getJsonOrString(value);
  } catch (error) {
    return handleError(error);
  }
}

export async function setAuthUser(token: string, user: TSessionUser) {
  try {
    await setRedisValue(token, JSON.stringify(user));
  } catch (error) {
    return handleError(error);
  }
}

/**
 * This method removes redis data associated with auth token
 * @param store
 */
export async function actionRemoveTokenFromCallback(
  store: ReadonlyRequestCookies,
) {
  if (!store) {
    console.log("no store while deleting: ");
    return;
  }
  const userUUID = await getSessionUserUUID(store);
  if (!userUUID) {
    console.log("no userUUID while deleting: ");
    return;
  }
  console.log("actionBeforeDeleteCookieCallback:", userUUID);
  await deleteRedisValue(userUUID);
}
