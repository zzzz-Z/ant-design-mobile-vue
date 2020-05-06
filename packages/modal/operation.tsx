import closest from '../_util/closest'
import Modal from './Modal'
import { Action } from './PropsType'
import { createApp, h, reactive } from 'vue'

export default function useOperation(
  actions: Action<React.CSSProperties>[] = [{ text: '确定' }],
  platform: string = 'ios'
) {
  const state = reactive({ visible: true })
  const close = () => (state.visible = false)
  const prefixCls = 'am-modal'
  const div = document.createElement('div')
  document.body.appendChild(div)

  function onAfterLeave() {
    App.unmount(div)
    div?.parentNode?.removeChild(div)
  }

  const footer = actions.map((button) => {
    const orginPress = button.onPress || function () {}
    button.onPress = function () {
      const res = orginPress(close)
      if (res && res.then) {
        res.then(() => close()).catch(() => {})
      }
    }
    return button
  })

  function onWrapTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return
    }
    const pNode = closest(e.target as Element, `.am-modal-footer`)
    if (!pNode) {
      e.preventDefault()
    }
  }

  const App = createApp(() =>
    h(Modal, {
      visible: state.visible,
      operation: true,
      transparent: true,
      prefixCls: prefixCls,
      transitionName: 'fade-in-linear',
      closable: false,
      maskClosable: true,
      onClose: close,
      footer: footer,
      maskTransitionName: 'am-fade',
      class: 'am-modal-operation',
      platform,
      onLeave: onAfterLeave,
      wrapProps: { onTouchStart: onWrapTouchStart },
    })
  )
  App.mount(div)

  return { close }
}
