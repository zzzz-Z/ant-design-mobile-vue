import { CascaderValue } from '../vc-cascader/src/CascaderTypes'
import { IPopupPickerProps } from '../vc-picker/src/PopupPickerTypes'
import { VNode } from 'vue'
export interface PickerData {
  value: string | number
  label: VNode
  children?: PickerData[]
}
export interface PickerPropsType extends IPopupPickerProps {
  data: PickerData[] | PickerData[][]
  cascade?: boolean
  value?: Array<string | number>
  format?: (values: VNode[]) => string | VNode[]
  cols?: number
  extra?: string
  onChange?: (date?: CascaderValue) => void
  onPickerChange?: (value: CascaderValue) => void
  itemStyle?: any
  indicatorStyle?: any
}
