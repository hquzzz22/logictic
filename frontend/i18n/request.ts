import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;
  if (locale === 'vi') {
    messages = (await import('../messages/vi.json')).default;
  } else {
    messages = (await import('../messages/en.json')).default;
  }

  return {
    locale,
    messages
  };
});
