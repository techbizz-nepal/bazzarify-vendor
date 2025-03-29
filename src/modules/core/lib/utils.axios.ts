import axios from "axios";
import process from "node:process";

const remoteData: Record<string, string> = {
  apiUrl: process.env.API_URL || "http://local-ne.larashops.local:8081/api/v1",
  appKey: process.env.APP_KEY || "",
};

const axiosInstance = axios.create({
  baseURL: remoteData.apiUrl,
  headers: {
    "User-Agent": "BazzarifyVendor",
    "Content-Type": "application/json",
    "X-APP-Key": remoteData.appKey,
  },
  validateStatus: (status) => status < 500,
});
export default axiosInstance;
