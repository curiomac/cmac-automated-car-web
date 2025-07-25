import axios, { AxiosInstance } from "axios";

export const createAPI = (
  url: string,
  customHeaders: Record<string, string> = {}
): AxiosInstance => {
  return axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  });
};
