import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
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
    onMounted(startCloseTimer)
    onBeforeUnmount(clearCloseTimer)

    return () => {
      const componentClass = `${props.prefixCls}-notice`
      const className = [
        props.class,
        {
          [`${componentClass}`]: 1,
          [`${componentClass}-closable`]: props.closable,
        },
      ]
      return (
        <div style={props.style} class={className}>
          <div class={`${componentClass}-content`}>{slots.default?.()} </div>
          {props.closable ? (
            <a tabindex={0} onClick={close} class={`${componentClass}-close`}>
              <span class={`${componentClass}-close-x`} />
            </a>
          ) : null}
        </div>
      )
    }
  },
})
