import { getCurrentInstance, inject } from 'vue'
import { AntLocaleInjectKey } from '../locale-provider/locale-provider'

export function useLocale(componentName?: any, getDefaultLocale?: () => any) {
  const instance = getCurrentInstance()!
  // const globalLocale = inject<any>(AntLocaleInjectKey)
  let globalLocale: any

  function getLocale() {
    let locale: any = {}
    const name = componentName || instance.type.name
    const ctxLocale = instance.props.locale as any
    const antLocale = globalLocale?.locale[name]
    const defaultLocale = getDefaultLocale?.()
    locale = antLocale || defaultLocale.default || defaultLocale

    let result = { ...locale, ...ctxLocale }
    if (ctxLocale?.lang) {
      result.lang = { ...locale.lang, ...ctxLocale.lang }
    }
    return result
  }

  function getLocaleCode() {
    const localeCode = globalLocale?.locale
    // Had use LocaleProvide but didn't set locale
    if (globalLocale?.exist && !localeCode) {
      return 'zh-cn'
    }
    return localeCode
  }

  return { getLocale, getLocaleCode }
}
