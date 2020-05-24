import { VNode, CSSProperties } from 'vue'

export interface IPopupPickerProps {
  picker?: any
  value?: any
  triggerType?: string
  WrapComponent?: any
  dismissText?: string | VNode // only for web
  okText?: string | VNode // only for web
  title?: string | VNode // only for web
  visible?: boolean
  disabled?: boolean
  onOk?: (value?: any) => void
  style?: any
  onVisibleChange?: (visible: boolean) => void
  content?: VNode | string
  onDismiss?: () => void
  /** react-native only */
  styles?: any
  actionTextUnderlayColor?: string
  actionTextActiveOpacity?: number
  /** web only */
  wrapStyle?: CSSProperties
  prefixCls?: string
  className?: string
  pickerValueProp?: string
  pickerValueChangeProp?: string
  transitionName?: string
  popupTransitionName?: string
  maskTransitionName?: string
}
