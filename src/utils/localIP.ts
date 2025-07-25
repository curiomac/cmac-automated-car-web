import { IP_ADDRESS_URL } from "../apis/baseURLs";

export const getLocalIP = async () => {
  try {
    const response = await fetch(IP_ADDRESS_URL);
    const data = await response.json();
    return data?.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
};
