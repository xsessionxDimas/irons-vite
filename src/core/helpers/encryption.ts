import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import CryptoJS from "crypto-js";

export const base64Encode = (input: string) => {
  const inputUtf = Utf8.parse(input);
  return Base64.stringify(inputUtf);
};

export const base64Decode = (input: string) => {
  const decodedBase64 = Base64.parse(input);
  return Utf8.stringify(decodedBase64);
};

export const aesEncode = (input: string, key: string) => {
  const inputUtf = Utf8.parse(input);
  const encrypted = CryptoJS.AES.encrypt(inputUtf, key);
  return encrypted;
};

export const aesDecode = (encrypted: string, key: string) => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key);
  return Utf8.stringify(decrypted);
};
