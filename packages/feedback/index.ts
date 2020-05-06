import { cloneVNode, ref, defineComponent, mergeProps } from 'vue'
export interface ITouchProps {
  disabled?: boolean
  activeClassName?: string
  activeStyle?: {}
  children?: any
}

export const TouchFeedback = defineComponent<ITouchProps>({
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const active = ref(false)
    const child = () => slots.default?.()[0]!
    const events = {
      onTouchStart: (e: TouchEvent) => triggerEvent('TouchStart', true, e),
      onTouchMove: (e: TouchEvent) => triggerEvent('TouchMove', false, e),
      onTouchEnd: (e: TouchEvent) => triggerEvent('TouchEnd', false, e),
      onTouchCancel: (e: TouchEvent) => triggerEvent('TouchCancel', false, e),
      onMouseDown: (e: TouchEvent) => triggerEvent('MouseDown', true, e),
      // onMouseover: (e: TouchEvent) => triggerEvent('Mouseover', true, e),
      onMouseUp: (e: TouchEvent) => triggerEvent('MouseUp', false, e),
      onMouseLeave: (e: TouchEvent) => triggerEvent('MouseLeave', false, e),
    }

    function triggerEvent(type: string, isActive: boolean, evt: TouchEvent) {
      const eventType = `on${type}`
      const eventHandle: any = child().props![eventType]
      eventHandle?.(evt)
      if (isActive !== active.value) {
        active.value = isActive
      }
    }

    return () => {
      const {
        disabled,
        activeClassName,
        activeStyle,
        style,
        prefixCls,
        ...restProps
      } = attrs
      const isActive = !disabled && active.value
      const evts = !disabled ? events : {}
      const activeCls =
        activeClassName || (activeStyle ? `${prefixCls}-active` : '')
       
      return cloneVNode(
        child(),
        mergeProps(restProps, {
          style: isActive && activeStyle !== false ? activeStyle : {},
          class: isActive && activeCls,
          ...evts,
        })
      )
    }
  },
})
