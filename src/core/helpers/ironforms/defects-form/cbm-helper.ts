/**
 * Returns the color corresponding to the given value.
 * @param val - The value to determine the color for.
 * @returns The color string.
 */
export const cbmValColor = (val: string) => {
  let color = ''
  switch (val) {
    case "A":
      color = "green"
      break;
    case "B":
      color = "blue"
      break;
    case "X":
      color = "red"
      break;
    case "C":
      color = "gold"
      break;
    default:
      break;
  }
  return color
}
