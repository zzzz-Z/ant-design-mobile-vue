import { HeaderPropsType } from './calendar/Header'
import { CSSProperties } from 'vue'
import { defineProps } from 'packages/_util/vue-types/defineProps'
import defaultLocale from './locale/zh_CN'
import { Locale, ExtraData } from './date/DataTypes'

export type SelectDateType = [Date, Date] | [Date]

export interface CalendarPropsType {
  /** 入场方向，default: vertical，vertical: 垂直，horizontal: 水平 */
  enterDirection?: 'horizontal' | 'vertical'
  /** 本地化 */
  locale?: Locale
  /** 关闭时回调 */
  onCancel?: () => void
  /** 清除时回调 */
  onClear?: () => void
  /** 确认时回调 */
  onConfirm?: (startDateTime?: Date, endDateTime?: Date) => void
  /** 是否选择时间，default: false */
  pickTime?: boolean
  /** (web only) 样式前缀，default: rmc-calendar */
  prefixCls?: string
  /** 替换快捷选择栏，需要设置showShortcut: true */
  renderShortcut?: (
    select: (startDate?: Date, endDate?: Date) => void
  ) => JSX.Element
  /** 替换标题栏 */
  renderHeader?: (prop: HeaderPropsType) => JSX.Element
  /** 快捷日期选择， default: false */
  showShortcut?: boolean
  style?: CSSProperties
  /** header title, default: {locale.title} */
  title?: string
  /** 选择类型，default: range，one: 单日，range: 日期区间 */
  type?: 'one' | 'range'
  /** 是否显示，default: false */
  visible?: boolean
  /** 默认选择值，开始时间、结束时间 */
  defaultValue?: SelectDateType

  // DatePicker
  /** 显示开始日期，default: today */
  defaultDate?: Date
  /** 日期扩展数据 */
  getDateExtra?: (date: Date) => ExtraData
  /** 无限滚动优化（大范围选择），default: false */
  infiniteOpt?: boolean
  /** 初始化月个数，default: 6 */
  initalMonths?: number
  /** 最大日期 */
  maxDate?: Date
  /** 最小日期 */
  minDate?: Date
  /** 选择区间包含不可用日期 */
  onSelectHasDisableDate?: (date: Date[]) => void
  /** 选择日期回调，如果有返回值，选择范围将使用返回值 */
  onSelect?: (
    date: Date,
    state?: [Date | undefined, Date | undefined]
  ) => SelectDateType | void
  /** 行大小，default: normal */
  rowSize?: 'normal' | 'xl'

  // TimePicker
  /** 默认时间选择值 */
  defaultTimeValue?: Date
  timePickerPrefixCls?: string
  timePickerPickerPrefixCls?: string
}

export const calendarProps = defineProps({
  visible: false,
  showHeader: true,
  locale: defaultLocale,
  pickTime: false,
  showShortcut: false,
  prefixCls: 'rmc-calendar',
  type: 'range',
  defaultTimeValue: new Date(2000, 0, 1, 8),
  enterDirection: String,
  onCancel: Function,
  onClear: Function,
  onConfirm: Function,
  renderShortcut: Function,
  renderHeader: Function,
  title: String,
  defaultValue: undefined,
  defaultDate: Date,
  getDateExtra: Function,
  infiniteOpt: Boolean,
  initalMonths: Number,
  maxDate: Date,
  minDate: Date,
  onSelectHasDisableDate: Function,
  onSelect: Function,
  rowSize: String,
  timePickerPrefixCls: String,
  timePickerPickerPrefixCls: String,
})
