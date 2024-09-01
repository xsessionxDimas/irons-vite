const ID_AUTH_INFO = "id_auth" as string;
const USER_INFO = "id_user" as string;

/**
 * @description get token form localStorage
 */
export const getAuthInfo = (): string | null => {
  return window.localStorage.getItem(ID_AUTH_INFO);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveAuthInfo = (token: string): void => {
  window.localStorage.setItem(ID_AUTH_INFO, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyAuthInfo = (): void => {
  window.localStorage.removeItem(ID_AUTH_INFO);
};

/**
 * @description get token form localStorage
 */
export const getUserInfo = (): string | null => {
  return window.localStorage.getItem(USER_INFO);
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveUserInfo = (tokenExpired: string): void => {
  window.localStorage.setItem(USER_INFO, tokenExpired);
};

/**
 * @description remove token form localStorage
 */
export const destroyUserInfo = (): void => {
  window.localStorage.removeItem(USER_INFO);
};

export default {
  getAuthInfo,
  saveAuthInfo,
  destroyAuthInfo,
  getUserInfo,
  saveUserInfo,
  destroyUserInfo
};
