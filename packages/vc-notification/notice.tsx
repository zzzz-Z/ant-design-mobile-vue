import { h, defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { defineProps } from '../_util/vue-types/defineProps'
interface Notice {
  duration?: number
  closable?: boolean
  prefixCls?: string
  style?: {}
  class?: any
  onClose?(): void
  onEnd?(): void
}
export default defineComponent<Notice>({
  name: 'Notice',
  inheritAttrs: false,
  props: defineProps({
    duration: 1.5,
    style: { right: '50%' },
    closable: Boolean,
    prefixCls: String,
  }),
  setup(props, { slots, emit }) {
    let closeTimer: number | null
    onMounted(() => {
      startCloseTimer()
    })
    onBeforeUnmount(() => {
      clearCloseTimer()
    })
    const close = () => {
      clearCloseTimer()
      emit('close')
    }

    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
    }
    const startCloseTimer = () => {
      if (props.duration) {
        closeTimer = window.setTimeout(() => {
          close()
        }, props.duration * 1000)
      }
    }

    return () => {
      const componentClass = `${props.prefixCls}-notice`
      const className = [
        props.class,
        {
          [`${componentClass}`]: 1,
          [`${componentClass}-closable`]: props.closable,
        },
      ]
      return h(
        'div',
        {
          style: props.style,
          class: className,
        },
        [
          h('div', { class: `${componentClass}-content` }, slots.default?.()),
          props.closable
            ? h(
                'a',
                {
                  tabIndex: '0',
                  onClick: close,
                  class: `${componentClass}-close`,
                },
                h('span', { class: `${componentClass}-close-x` })
              )
            : null,
        ]
      )
    }
  },
})
