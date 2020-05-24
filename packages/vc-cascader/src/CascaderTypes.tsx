import { VNode } from 'vue'
import { defineProps } from 'packages/_util/vue-types/defineProps'

export type CascaderOneValue = string | number
export type CascaderValue = CascaderOneValue[]

export interface ICascaderDataItem {
  label: VNode
  value: CascaderOneValue
  children?: ICascaderDataItem[]
}

export interface ICascaderProps {
  defaultValue?: CascaderValue
  value?: CascaderValue
  onChange?: (value: CascaderValue) => void
  data: ICascaderDataItem[]
  cols?: number
  disabled?: boolean
  rootNativeProps?: {}
  pickerItemStyle?: {}
  indicatorStyle?: {}
  style?: any
  /** web only */
  prefixCls?: string
  /** web only */
  pickerPrefixCls?: string
  /** web only */
  className?: string
  /** web only */
  onScrollChange?: (value: CascaderValue) => void
}

export const cascaderProps = defineProps({
  defaultValue: Array,
  value: Array,
  rootNativeProps: {},
  pickerItemStyle: {},
  indicatorStyle: {},
  cols: 3,
  prefixCls: 'rmc-cascader',
  pickerPrefixCls: 'rmc-picker',
  data: [],
  disabled: false,
})
