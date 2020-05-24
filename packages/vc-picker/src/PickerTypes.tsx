import { defineProps } from 'packages/_util/vue-types/defineProps'

export interface IPickerProps {
  key: number
  disabled?: boolean
  selectedValue?: any
  onValueChange?: (value: any) => void
  itemStyle?: any
  /** web only */
  prefixCls?: string
  indicatorStyle?: any
  indicatorClassName?: string
  className?: string
  defaultSelectedValue?: any
  style?: any
  onScrollChange?: (value: any) => void
  noAnimate?: boolean
}

export const pickerProps = defineProps({
  key: Number,
  disabled: Boolean,
  noAnimate: Boolean,
  selectedValue: undefined,
  itemStyle: undefined,
  /** web only */
  select: Function,
  doScrollingComplete: Function,
  computeChildIndex: Function,
  prefixCls: 'rmc-picker',
  indicatorStyle: undefined,
  indicatorClassName: String,
  defaultSelectedValue: undefined,
})
