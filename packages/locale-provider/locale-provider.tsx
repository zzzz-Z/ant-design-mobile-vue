import { defineComponent, provide } from 'vue'

export interface LocaleProviderProps {
  locale: {
    Pagination?: object
    DatePicker?: object
    DatePickerView?: object
    InputItem?: object
  }
}

export const AntLocaleInjectKey = Symbol('AntLocale')

const LocaleProvider = defineComponent<LocaleProviderProps>({
  inheritAttrs: false,
  props: { locale: Object } as any,
  setup(props, { slots }) {
    provide(AntLocaleInjectKey, { ...props.locale, exist: true })
    return () => slots.default?.()
  },
})

export default LocaleProvider
