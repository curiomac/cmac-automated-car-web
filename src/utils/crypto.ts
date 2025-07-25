import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_APP_CRYPTO_SECRET_KEY;

const encode = (data = "") => {
  if (!data) {
    throw new Error("No data provided for encryption.");
  }
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
};

const decode = (encryptedData = "") => {
  if (!encryptedData) {
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const crypto = {
  encode,
  decode,
};
