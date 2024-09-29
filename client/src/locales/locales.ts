// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en.json'
import tr from './lang/tr.json'
import appConfig from '@/configs/app.config'

const resources = {
    en: {
        translation: en,
    },
    tr: {
        translation: tr,
    },
}

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: appConfig.locale,
    lng: appConfig.locale,
    interpolation: {
        escapeValue: false,
    },
})

export const dateLocales: {
    [key: string]: () => Promise<ILocale>
} = {
    en: () => import('dayjs/locale/en'),
    tr: () => import('dayjs/locale/tr'),
}

export default i18n
