const getRandomInt = (min, max) => {
  // Create byte array and fill with 1 random number
  const byteArray = new Uint8Array(1);
  window.crypto.getRandomValues(byteArray);

  const range = max - min + 1;
  const max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range) {
    return getRandomInt(min, max);
  }
  return min + (byteArray[0] % range);
}

export const generateRandomColorClass = () => {
  const idx = getRandomInt(0, 6);

  const color = [
    // 'abstract',
    // 'lighter',
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "dark",
    // 'gray',
    // 'light',
    // "blue",
    // "azure",
    // "indigo",
    // "purple",
    // "pink",
    // "orange",
    // "teal",
    // 'blue-dim',
    // 'azure-dim',
    // 'indigo-dim',
    // 'purple-dim',
    // 'pink-dim',
    // 'orange-dim',
    // 'teal-dim',
    // 'primary-dim',
    // 'secondary-dim',
    // 'success-dim',
    // 'info-dim',
    // 'warning-dim',
    // 'danger-dim',
    // 'dark-dim',
    // 'gray-dim',
  ];

  return color[idx];
};
