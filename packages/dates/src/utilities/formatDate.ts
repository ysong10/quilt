import {memoize} from '@shopify/function-enhancers';

const memoizedGetDateTimeFormat = memoize(
  getDateTimeFormat,
  dateTimeFormatCacheKey,
);

interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  hourCycle?: string;
}

export function formatDate(
  date: Date,
  locales: string | string[],
  options: FormatDateOptions = {},
) {
  // Etc/GMT+12 is not supported in most browsers and there is no equivalent fallback
  if (options.timeZone != null && options.timeZone === 'Etc/GMT+12') {
    const adjustedDate = new Date(date.valueOf() - 12 * 60 * 60 * 1000);

    if (options.hour12 != null) {
      options.hour12 = undefined;
      options.hourCycle = 'h23';
    }

    return memoizedGetDateTimeFormat(locales, {
      ...options,
      timeZone: 'UTC',
    }).format(adjustedDate);
  }

  return memoizedGetDateTimeFormat(locales, options).format(date);
}

function getDateTimeFormat(
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  return Intl.DateTimeFormat(locales, options);
}

function dateTimeFormatCacheKey(
  locales: string | string[],
  options?: Intl.DateTimeFormatOptions,
) {
  return `${locales}-${JSON.stringify(options)}`;
}
