import Modal from 'packages/vc-dialog'
import PopupMixin from './PopupMixin'
import { TouchFeedback } from 'packages/feedback'

const getModal = (
  props: {
    className?: any
    transitionName?: any
    popupTransitionName?: any
    maskTransitionName?: any
    style?: any
    dismissText?: any
    title?: any
    okText?: any
    prefixCls?: any
  },
  visible: any,
  { getContent, hide, onDismiss, onOk }: any
) => {
  // if (!visible) {
  //   return null
  // }
  const { prefixCls } = props
  return (
    <Modal
      visible={visible}
      prefixCls={`${prefixCls}`}
      class={props.className || ''}
      closable={false}
      transitionName={props.transitionName || props.popupTransitionName}
      maskTransitionName={props.maskTransitionName}
      onClose={hide}
      style={props.style}
    >
      <div>
        <div class={`${prefixCls}-header`}>
          <TouchFeedback activeClassName={`${prefixCls}-item-active`}>
            <div
              class={`${prefixCls}-item ${prefixCls}-header-left`}
              onClick={onDismiss}
            >
              {props.dismissText}
            </div>
          </TouchFeedback>
          <div class={`${prefixCls}-item ${prefixCls}-title`}>
            {props.title}
          </div>
          <TouchFeedback activeClassName={`${prefixCls}-item-active`}>
            <div
              class={`${prefixCls}-item ${prefixCls}-header-right`}
              onClick={onOk}
            >
              {props.okText}
            </div>
          </TouchFeedback>
        </div>
        {getContent()}
      </div>
    </Modal>
  )
}

export default PopupMixin(getModal, {
  prefixCls: 'rmc-picker-popup',
  WrapComponent: 'span',
  triggerType: 'onClick',
  pickerValueProp: 'selectedValue',
  pickerValueChangeProp: 'onValueChange',
})
