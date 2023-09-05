import { format, utcToZonedTime } from 'date-fns-tz';

export const boolToString = (value: boolean): string => (value ? 'true' : 'false');

/// This implementation of getAbsoluteUrl assumes you are running the site via `npx serve@latest out`, it won't work
/// in development mode
export const getAbsoluteUrl = (relativePath: string): string =>
  process.env.URL
    ? `${process.env.URL}/${relativePath}`
    : global.document?.location?.origin
    ? `${global.document.location.origin}/${relativePath}`
    : `http://localhost:3000/${relativePath}`;

export const formatDate = (date: Date, formatString: string): string =>
  format(utcToZonedTime(date, 'UTC'), formatString, { timeZone: 'UTC' });
