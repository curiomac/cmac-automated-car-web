import { createAPI } from "../axios";
import { IP_INFO_URL } from "../baseURLs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { getLocalIP } from "../../utils/localIP";

const IP_INFO_ACCESSS_TOKEN = import.meta.env.VITE_APP_IP_INFO_ACCESS_TOKEN;

const api = createAPI(IP_INFO_URL, {
  Authorization: `Bearer ${import.meta.env.VITE_APP_API_KEY || ""}`,
});

const getIPInfo = async <T>(config?: AxiosRequestConfig): Promise<T> => {
  try {
    const ip = await getLocalIP();
    const response: AxiosResponse<T> = await api.get(
        `${ip}?token=${IP_INFO_ACCESSS_TOKEN}`,
        config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getIPInfo };
