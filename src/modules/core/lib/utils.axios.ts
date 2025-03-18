import axios from "axios";

const remoteData: Record<string, string> = {
  remote: "https://local-ne.bazzarify.com/api/v1", // remove android:usesCleartextTraffic="true" after ssl activated for the domain
  local: "http://192.168.1.64/api/v1",
  appKey: process.env.APP_KEY as string,
};

const axiosInstance = axios.create({
  baseURL: remoteData.local,
  headers: {
    Authorization: `Bearer ${remoteData.appKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-APP-KEY": remoteData.appKey,
  },
  validateStatus: (status) => status < 500,
});
export default axiosInstance;
