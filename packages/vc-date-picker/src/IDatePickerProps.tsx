import { defineProps } from 'packages/_util/vue-types/defineProps'
import defaultLocale from './locale/en_US'

interface IDatePickerProps {
  date?: any
  defaultDate?: any
  minDate?: any
  maxDate?: any
  minHour?: number
  maxHour?: number
  minMinute?: number
  maxMinute?: number
  mode?: string
  disabled?: boolean
  locale?: any
  minuteStep?: number
  formatMonth?: (month: number, date?: any) => any
  formatDay?: (day: number, date?: any) => any
  onDateChange?: (date: any) => void
  onValueChange?: (vals: any, index: number) => void
  itemStyle?: any
  style?: any
  /** web only */
  prefixCls?: string
  /** web only */
  onScrollChange?: (date: any, vals: any, index: number) => void
  rootNativeProps?: {}
  pickerPrefixCls?: string
  className?: string
  use12Hours?: boolean
}

export const datePickerProps = defineProps({
  prefixCls: 'rmc-date-picker',
  pickerPrefixCls: 'rmc-picker',
  locale: defaultLocale,
  mode: 'date',
  disabled: false,
  minuteStep: 1,
  onDateChange() {},
  use12Hours: false,
  date: undefined,
  defaultDate: undefined,
  minDate: undefined,
  maxDate: undefined,
  minHour: Number,
  maxHour: Number,
  minMinute: Number,
  maxMinute: Number,
  formatMonth: Function,
  formatDay: Function,
  onValueChange: Function,
  itemStyle: undefined,
  onScrollChange: Function,
  rootNativeProps: Object,
})

export default IDatePickerProps
