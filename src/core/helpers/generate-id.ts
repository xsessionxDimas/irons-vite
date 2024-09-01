function dec2hex(dec) {
  return dec.toString(16).padStart(2, "0");
}

export const generateId = (length: number): string => {
  const arr = new Uint8Array((length + 1 || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};
