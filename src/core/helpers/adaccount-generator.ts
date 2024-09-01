const ADAccountGenerator = (email: string): string => {
  return `BUKITMAKMUR\\${email.split("@")[0]}`;
};

export { ADAccountGenerator };
