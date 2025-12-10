import { SUPPORTED_LOCALES } from './locales';
import { Locale } from 'next-intl';

/** Helper function to check for internationalized routes.
 *
 * @param pathname The entire path, from request.nextUrl.pathname
 * @returns Whether the route is internationalized */
export function isRouteInternationalized(pathname: string) {
  if (pathname.length > 1) {
    // Intl = internationalized
    const possibleIntl = pathname.split('/')[1];
    if (SUPPORTED_LOCALES.includes(possibleIntl as Locale)) {
      return true;
    }
  }

  return false;
}
