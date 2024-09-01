/**
 * @description get value form localStorage
 */
export const getCacheValue = (key:string): string | null => {
  return window.localStorage.getItem(key);
};

/**
   * @description save value into localStorage
   * @param token: string
   */
export const saveCacheValue = (key:string, value: string): void => {
  window.localStorage.setItem(key, value);
};

export const telemetryExists = (): unknown | undefined => {
  const keys = Object.keys(localStorage);
  return keys.find((x) => {
    return x.includes('server-telemetry');
  });
}

/**
   * @description clear localStorage
   */
export const destroyCaches = (): void => {
  window.localStorage.clear();
};

export const destroyCache = (key: string): void => {
  window.localStorage.removeItem(key);
}

export default {
  getCacheValue,
  saveCacheValue,
  destroyCaches,
  telemetryExists
};
