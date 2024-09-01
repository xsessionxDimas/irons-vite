export const searchInString = (input, string) => {
  return (
    input &&
    input.toString().toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) !==
      -1
  );
};
