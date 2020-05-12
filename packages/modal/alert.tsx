import closest from '../_util/closest'
import Modal from './Modal'
import { Action } from './PropsType'
import { createApp, h, VNode, reactive, CSSProperties } from 'vue'

export default function useAlert(
  title: string | VNode | (() => VNode),
  message: string | VNode | (() => VNode),
  actions: Action<CSSProperties>[] = [{ text: '确定' }],
  platform = 'ios'
) {
  const state = reactive({ visible: true })
  const close = () => (state.visible = false)
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

  function onWrapTouchStart(e: TouchEvent) {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return
    }
    const pNode = closest(e.target as Element, `.am-modal-footer`)
    if (!pNode) {
      e.preventDefault()
    }
  }

  const App = createApp(() =>
    h(
      Modal,
      {
        visible: true,
        transparent: true,
        title: title,
        transitionName: 'zoom-in-center',
        closable: false,
        maskClosable: false,
        footer,
        maskTransitionName: 'am-fade',
        platform,
        onLeave: onAfterLeave,
        wrapProps: { onTouchStart: onWrapTouchStart },
      },
      () =>
        h(
          'div',
          { class: 'am-modal-alert-content' },
          typeof message == 'function' ? message() : message
        )
    )
  )
  App.mount(div)

  return { close }
}
