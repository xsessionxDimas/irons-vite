export const translate = (text: string, t, te) => {
  if (te(text)) {
    return t(text);
  } else {
    return text;
  }
};
