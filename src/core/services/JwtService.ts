const ID_TOKEN_KEY = "id_token" as string;
const ID_EXPIRED_TOKEN = "id_expired_token" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * @description get token form localStorage
 */
export const getTokenExpired = (): string | null => {
  return window.localStorage.getItem(ID_EXPIRED_TOKEN);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveTokenTokenExpired = (tokenExpired: string): void => {
  window.localStorage.setItem(ID_EXPIRED_TOKEN, tokenExpired);
};

/**
 * @description remove token form localStorage
 */
export const destroyTokenExpired = (): void => {
  window.localStorage.removeItem(ID_EXPIRED_TOKEN);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  getTokenExpired,
  saveTokenTokenExpired,
  destroyTokenExpired
};
