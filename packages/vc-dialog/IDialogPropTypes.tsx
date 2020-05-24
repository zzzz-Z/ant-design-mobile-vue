import { VNode, PropType } from 'vue'
export interface IDialogPropTypes {
  className?: string
  style?: {}
  mask?: boolean
  children?: any
  afterClose?: () => void
  onClose?: (e: any) => void
  closable?: boolean
  maskClosable?: boolean
  visible?: boolean
  title?: VNode | string
  footer?: VNode | string
  transitionName?: string
  maskTransitionName?: string
  animation?: any
  maskAnimation?: any
  wrapStyle?: {}
  bodyStyle?: {}
  maskStyle?: {}
  prefixCls?: string
  wrapClassName?: string
  onAnimateLeave?: () => void
  zIndex?: number
  maskProps?: any
  wrapProps?: any
}
export const dialogProps = {
  mask: { default: true, type: Boolean as PropType<boolean> },
  visible: { default: false, type: Boolean as PropType<boolean> },
  keyboard: { default: true, type: Boolean as PropType<boolean> },
  closable: { default: true, type: Boolean as PropType<boolean> },
  maskClosable: { default: true, type: Boolean as PropType<boolean> },
  destroyOnClose: { default: false, type: Boolean as PropType<boolean> },
  prefixCls: { default: 'rmc-dialog', type: String as PropType<string> },
  afterClose: Function,
  title: [String, Object] as PropType<VNode | string | (() => VNode)>,
  footer: [String, Object] as PropType<VNode | string>,
  transitionName: String,
  maskTransitionName: String,
  animation: null,
  maskAnimation: null,
  wrapStyle: Object,
  bodyStyle: Object,
  maskStyle: Object,
  wrapClassName: null,
  zIndex: Number,
  maskProps: Object,
  wrapProps: Object,
}
