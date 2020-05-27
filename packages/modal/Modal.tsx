import Dialog from '../vc-dialog'
import { TouchFeedback } from '../feedback'
import { Action, ModalPropsType } from './PropsType'
import { FunctionalComponent, h, CSSProperties } from 'vue'

export interface ModalProps extends ModalPropsType {
  prefixCls?: string
  transitionName?: string
  maskTransitionName?: string
  class?: string
  wrapClassName?: string
  wrapProps?: any
  platform?: string
  style?: CSSProperties
  bodyStyle?: CSSProperties
}

function renderFooterButton(
  button: Action<CSSProperties>,
  prefixCls: string | undefined,
  i: number
) {
  let buttonStyle = {}
  if (button.style) {
    buttonStyle = button.style
    if (typeof buttonStyle === 'string') {
      const styleMap: {
        [key: string]: object
      } = {
        cancel: {},
        default: {},
        destructive: { color: 'red' },
      }
      buttonStyle = styleMap[buttonStyle] || {}
    }
  }

  const onClickFn = (e: MouseEvent) => {
    e.preventDefault()
    if (button.onPress) {
      button.onPress()
    }
  }

  return h(
    TouchFeedback,
    { activeClassName: `${prefixCls}-button-active`, key: i },
    () =>
      h(
        'a',
        {
          class: `${prefixCls}-button`,
          role: 'button',
          style: buttonStyle,
          onClick: onClickFn,
        },
        button.text || 'Button'
      )
  )
}

const ModalComponent: FunctionalComponent<ModalProps> = (props, { slots }) => {
  const {
    prefixCls = 'am-modal',
    transparent = false,
    popup = false,
    wrapClassName = '',
    animationType = 'slide-down',
    animated = true,
    footer = [],
    closable = false,
    operation = false,
    platform = 'ios',
    visible = false,
    transitionName,
    maskTransitionName,
    ...restProps
  } = props

  const ftcls = [
    `${prefixCls}-button-group-${
      footer.length === 2 && !operation ? 'h' : 'v'
    }`,
    `${prefixCls}-button-group-${operation ? 'operation' : 'normal'}`,
  ]

  const footerDom = footer.length ? (
    <div role="group" class={ftcls}>
      {footer.map((button, i) => renderFooterButton(button, prefixCls, i))}
    </div>
  ) : null

  let transName
  let maskTransName
  if (animated) {
    if (transparent) {
      transName = maskTransName = 'am-fade'
    } else {
      transName = maskTransName = 'am-slide-up'
    }
    if (popup) {
      transName = animationType === 'slide-up' ? 'am-slide-up' : 'am-slide-down'
      maskTransName = 'am-fade'
    }
  }

  const wrapCls = [
    wrapClassName,
    {
      [`${prefixCls}-wrap-popup`]: popup,
    },
  ]
  const cls = [
    prefixCls,
    {
      [`${prefixCls}-transparent`]: transparent,
      [`${prefixCls}-popup`]: popup,
      [`${prefixCls}-popup-${animationType}`]: popup && animationType,
      [`${prefixCls}-android`]: platform === 'android',
    },
  ]

  return h(
    Dialog,
    {
      ...restProps,
      prefixCls,
      class: cls,
      visible,
      wrapClassName: wrapCls,
      transitionName: transitionName || transName,
      maskTransitionName: maskTransitionName || maskTransName,
      footer: footerDom,
    },
    () => slots.default?.()
  )
}

export default ModalComponent
