import { Dialog } from '../vc-dialog'
import { TouchFeedback } from '../feedback'
import { Action, ModalPropsType } from './PropsType'
import { FunctionalComponent, h } from 'vue'

export interface ModalProps extends ModalPropsType {
  prefixCls?: string
  transitionName?: string
  maskTransitionName?: string
  class?: string
  wrapClassName?: string
  wrapProps?: Partial<React.HTMLProps<HTMLDivElement>>
  platform?: string
  style?: React.CSSProperties
  bodyStyle?: React.CSSProperties
}

function renderFooterButton(
  button: Action<React.CSSProperties>,
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

  const onClickFn = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

const ModalComponent: FunctionalComponent<ModalProps> = (_props, { slots }) => {
  const props: ModalProps = {
    prefixCls: 'am-modal',
    transparent: false,
    popup: false,
    wrapClassName: '',
    animationType: 'slide-down',
    animated: true,
    footer: [],
    closable: false,
    operation: false,
    platform: 'ios',
    visible: false,
    ..._props,
  }

  const {
    prefixCls,
    wrapClassName,
    transitionName,
    maskTransitionName,
    platform,
    footer = [],
    operation,
    animated,
    transparent,
    popup,
    animationType,
    ...restProps
  } = props

  const footerDom = footer.length
    ? h(
        'div',
        {
          role: 'group',
          class: [
            `${prefixCls}-button-group-${
              footer.length === 2 && !operation ? 'h' : 'v'
            }`,
            `${prefixCls}-button-group-${operation ? 'operation' : 'normal'}`,
          ],
        },
        footer.map((button, i) => renderFooterButton(button, prefixCls, i))
      )
    : null

  let transName
  let maskTransName
  if (animated) {
    // tslint:disable-next-line:prefer-conditional-expression
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
      wrapClassName: wrapCls,
      transitionName: transitionName || transName,
      maskTransitionName: maskTransitionName || maskTransName,
      footer: footerDom!,
    },
    () => slots.default?.()
  )
}

export default ModalComponent
