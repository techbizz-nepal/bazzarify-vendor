"use server";

import {
  deleteSession,
  getSessionPayload,
} from "@/modules/core/lib/utils.session";
import axios, { CreateAxiosDefaults } from "axios";
import { JWTPayload } from "jose";
import { redirect } from "next/navigation";

const remoteData: Record<string, string> = {
  apiUrl: process.env.API_URL || "http://local-ne.larashops.local:8081/api/v1",
  appKey: process.env.APP_KEY || "",
};
const defaultConfig: CreateAxiosDefaults = {
  baseURL: remoteData.apiUrl,
  headers: {
    "User-Agent": "BazzarifyVendor",
    "Content-Type": "application/json",
    "X-APP-Key": remoteData.appKey,
  },
  validateStatus: (status) => status < 500,
};

export const defaultAxiosInstance = axios.create({
  ...defaultConfig,
});

export const authAxiosInstance = async () => {
  const payload: JWTPayload | null = await getSessionPayload();
  if (!payload) {
    redirect("/login");
  }
  const token = payload.token;
  // const token = "";
  const instance = axios.create({
    ...defaultConfig,
    headers: { Authorization: `Bearer ${token}` },
  });
  instance.interceptors.response.use((response) => {
    if (response.data?.metaData?.errorCode === 401) {
      deleteSession();
      redirect("/login");
    }
    return response;
  });
  return instance;
};
