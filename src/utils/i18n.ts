import {I18n} from 'i18n-js';
import te from './locales/te';

const i18n = new I18n();
i18n.locale = 'te';
i18n.enableFallback = false;
i18n.translations = {te};
i18n.missingTranslation.get = text => `${text}`;

export const translate = (text: string) => i18n.t(text);

export default i18n;
