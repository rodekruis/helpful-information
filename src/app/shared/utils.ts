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

export const getDateFromString = (value: string): Date | null => {
  const cleanValue = value.trim().substring(0, 10);

  try {
    const date = new Date(cleanValue + 'T00:00:00.000Z');
    const isoDate = date.toISOString();

    return isoDate.startsWith(cleanValue) ? date : null;
  } catch {
    return null;
  }
};
