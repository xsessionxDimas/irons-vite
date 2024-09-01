import currency from "currency.js";

export const convertToCurrencyFormat = (input: string) => {
  return currency(Number(input), { separator: ".", decimal: "," }).format();
};
