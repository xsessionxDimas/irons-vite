export const elapsedTime = (start: Date) => {
  const end = new Date().getTime();
  const timeDiff = (end - start.getTime()) / 1000;
  // get seconds
  return Math.round(timeDiff);
};

export const epochToDate = (epochTime: number): Date => {
  const date = new Date(0);
  date.setUTCSeconds(epochTime);
  return date;
}
