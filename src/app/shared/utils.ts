import { SlugPrefix } from 'src/app/models/slug-prefix.enum';

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

/**
 * Create a slug based on input-`value`, or a fallback
 */
export const createSlug = (
  value: string,
  identifier: number | string,
  prefix?: SlugPrefix | string,
): string => {
  if (value && value.length > 0) {
    return value;
  }
  let slug = String(identifier);

  if (prefix && identifier) {
    slug = prefix + '-' + slug;
  }

  return slug;
};

export const getLegacyID = (
  slug: string,
  prefix: SlugPrefix | string,
): number | null => {
  if (!slug) {
    return null;
  }

  if (!prefix || !prefix.match(/[a-z]+/)) {
    return null;
  }
  const matched = slug.match(new RegExp('' + prefix + '-([0-9]+)', 'i'));

  if (matched) {
    const fallbackID = Number(matched[1]);

    return !isNaN(fallbackID) ? fallbackID : null;
  }
  return null;
};

export const getParentPath = (fullPath: string): string => {
  return fullPath.split('/').slice(0, -1).join('/');
};

export const getPathDepth = (fullPath: string): number => {
  return fullPath.split('/').length - 1;
};

export const formatPhoneNumberAsUrl = (rawNumber: string): string => {
  const firstNumber = rawNumber.match(/[\d+]/);
  const phoneNumberStart = firstNumber ? firstNumber.index : 0;

  const rawTrimmedAtStart = rawNumber.substring(phoneNumberStart);

  const firstNonNumber = rawTrimmedAtStart.match(/[a-z]/i);
  const phoneNumberEnd = firstNonNumber ? firstNonNumber.index : undefined;

  const phoneNumber = rawTrimmedAtStart.substring(0, phoneNumberEnd);

  const onlyDigits = phoneNumber.replaceAll(/[^\d+]/g, '');

  return 'tel:' + onlyDigits;
};

export const fillTemplateWithUrl = (template: string, url: string): string => {
  if (!template) {
    return '';
  }

  return template.replaceAll('{URL}', window.encodeURIComponent(url));
};
