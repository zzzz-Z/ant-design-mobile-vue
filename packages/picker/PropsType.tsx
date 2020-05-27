import { CascaderValue } from '../vc-cascader/src/CascaderTypes'
import { IPopupPickerProps } from '../vc-picker/src/PopupPickerTypes'
import { VNode } from 'vue'
export interface PickerData {
  value: string | number
  label: JSX.Element
  children?: PickerData[]
}
export interface PickerPropsType extends IPopupPickerProps {
  data: PickerData[] | PickerData[][]
  cascade?: boolean
  value?: Array<string | number>
  format?: (values: JSX.Element) => JSX.Element | JSX.Element[] | undefined
  cols?: number
  extra?: string
  onChange?: (date?: CascaderValue) => void
  onPickerChange?: (value: CascaderValue) => void
  itemStyle?: any
  indicatorStyle?: any
}
