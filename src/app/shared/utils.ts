export const toKebabCase = (value: string) => {
  return value
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('-');
};

export const getFullUrl = (value: string): string => {
  if (
    value &&
    value.length > 6 &&
    !value.startsWith('http://') &&
    !value.startsWith('https://')
  ) {
    value = 'https://' + value;
  }
  return value;
};
