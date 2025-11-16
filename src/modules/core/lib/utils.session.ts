"use server";

import {
  TSessionUser,
  TSessionUserWithToken,
} from "@/modules/auth/domain/schemas/UserSchema";
import { getTokenExpirationDate } from "@/modules/core/lib/utils.index";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function getSessionPayload() {
  const cookieStore = await cookies();

  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  const payload = await decrypt(session);
  if (!payload) return null;
  return payload;
}
export async function updateSessionWithUser(user: TSessionUser): Promise<void> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    const decodedSession = await decrypt(session?.value);
    if (!decodedSession) {
      throw new Error("Could not update session without token session");
    }
    const encryptedUser = await new SignJWT({ ...decodedSession, ...user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(getTokenExpirationDate())
      .sign(encodedKey);

    cookieStore.set("session", encryptedUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: getTokenExpirationDate(),
      sameSite: "strict",
      path: "/",
    });
  } catch (error) {
    throw error;
  }
}
export async function createTokenSession(token: string): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await new SignJWT({ token, expiresAt })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);
    const cookieStore = await cookies();

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "strict",
      path: "/",
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  try {
    // Attempt standard deletion first (no domain)
    cookieStore.delete("session");

    // Force expire for robustness (no domain)
    cookieStore.set("session", "", {
      expires: new Date(0),
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    // Ensure removal even if delete throws in certain runtimes
    cookieStore.set("session", "", {
      expires: new Date(0),
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }
}

async function encrypt(payload: TSessionUserWithToken) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error: unknown) {
    console.error("Failed to verify session", error);
  }
}
