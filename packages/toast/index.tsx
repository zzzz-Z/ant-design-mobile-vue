import './style'
import { useNotification } from '../vc-notification'

import Icon from '../icon'
import { h, VNode } from 'vue'

const SHORT = 3

interface IToastConfig {
  duration: number
  mask: boolean
}

const config: IToastConfig = {
  duration: SHORT,
  mask: true,
}

let messageInstance: any
let messageNeedHide: boolean
const prefixCls = 'am-toast'

function getMessageInstance(mask: boolean) {
  return useNotification({
    prefixCls,
    style: {}, // clear rmc-notification default style
    transitionName: 'am-fade',
    class: {
      [`${prefixCls}-mask`]: mask,
      [`${prefixCls}-nomask`]: !mask,
    },
  })
}

function notice(
  content: VNode | string,
  type: string,
  duration = config.duration,
  onClose: (() => void) | undefined | null,
  mask = config.mask
) {
  const iconTypes: { [key: string]: string } = {
    info: '',
    success: 'success',
    fail: 'fail',
    offline: 'dislike',
    loading: 'loading',
  }
  const iconType = iconTypes[type]
  messageNeedHide = false
  let instance = getMessageInstance(mask)
  if (!instance) {
    return
  }
  if (messageInstance) {
    messageInstance.destroy()
    messageInstance = null
  }
  if (messageNeedHide) {
    instance.destroy()
    messageNeedHide = false
    return
  }
  messageInstance = instance
  instance.notice({
    duration,
    style: {},
    closable: true,
    onClose() {
      onClose?.()
      instance.destroy()
      messageInstance = null
    },
    content: !!iconType
      ? h(
          'div',
          {
            class: `${prefixCls}-text ${prefixCls}-text-icon`,
            role: 'alert',
            'aria-live': 'assertive',
          },
          [
            h(Icon, { type: iconType, size: 'lg' }),
            h('div', { class: `${prefixCls}-text-info` }, content),
          ]
        )
      : h(
          'div',
          {
            class: `${prefixCls}-text ${prefixCls}-text-icon`,
            role: 'alert',
            'aria-live': 'assertive',
          },
          [h('div', content)]
        ),
  })
}

export default {
  SHORT,
  LONG: 8,
  show(content: VNode | string, duration?: number, mask?: boolean) {
    return notice(content, 'info', duration, () => {}, mask)
  },
  info(
    content: VNode | string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'info', duration, onClose, mask)
  },
  success(
    content: VNode | string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'success', duration, onClose, mask)
  },
  fail(
    content: VNode | string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'fail', duration, onClose, mask)
  },
  offline(
    content: VNode | string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'offline', duration, onClose, mask)
  },
  loading(
    content: VNode | string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'loading', duration, onClose, mask)
  },
  hide() {
    if (messageInstance) {
      messageInstance.destroy()
      messageInstance = null
    } else {
      messageNeedHide = true
    }
  },
  config(conf: Partial<IToastConfig> = {}) {
    const { duration = SHORT, mask } = conf
    config.duration = duration
    if (mask === false) {
      config.mask = false
    }
  },
}
