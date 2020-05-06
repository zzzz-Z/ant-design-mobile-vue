import { VNode, PropType } from 'vue'

export const dialogPropTypes = {
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

export default dialogPropTypes
