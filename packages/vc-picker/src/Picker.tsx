import { IPickerProps, pickerProps } from './PickerTypes'
import PickerMixin, { IItemProps } from './PickerMixin'
import {
  defineComponent,
  Events,
  computed,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  onUpdated,
  ref,
  VNode,
  getCurrentInstance,
} from 'vue'

export interface IPickerProp {
  select: (...arg: any) => void
  doScrollingComplete: (...arg: any) => void
  computeChildIndex: (...arg: any) => number
}

const Picker = defineComponent<IPickerProp & IPickerProps>({
  props: pickerProps,
  setup(props, { slots, emit }) {
    let selectedValueState
    let itemHeight: number
    let scrollValue: any

    const { selectedValue, defaultSelectedValue } = props
    if (selectedValue !== undefined) {
      selectedValueState = selectedValue
    } else if (defaultSelectedValue !== undefined) {
      selectedValueState = defaultSelectedValue
    } else {
      const children = slots.default?.()[0]
      selectedValueState = children?.props?.value
    }
    /**  ~~~~~~~~~~~~~state~~~~~~~~~~~~~~~~ */
    const state = reactive({
      selectedValue: selectedValueState,
    })
    /**  ~~~~~~~~~~~~~ctx~~~~~~~~~~~~~~~~ */
    const ctx = (getCurrentInstance() as any).ctx
    ctx.getValue = getValue
    /** ~~~~~~~~~~~~~~ref~~~~~~~~~~~~~~~~~~~~~*/
    const rootRef = ref<HTMLDivElement | null>(null)
    const maskRef = ref<HTMLDivElement | null>(null)
    const contentRef = ref<HTMLDivElement | null>(null)
    const indicatorRef = ref<HTMLDivElement | null>(null)
    /** ~~~~~~~~~~~~~~ref~~~~~~~~~~~~~~~~~~~~~*/

    const scrollHanders = computed(() => {
      let scrollY = -1
      let lastY = 0
      let startY = 0
      let scrollDisabled = false
      let isMoving = false

      const setTransform = (nodeStyle: CSSStyleDeclaration, value: any) => {
        nodeStyle.transform = value
        nodeStyle.webkitTransform = value
      }

      const setTransition = (nodeStyle: CSSStyleDeclaration, value: any) => {
        nodeStyle.transition = value
        nodeStyle.webkitTransition = value
      }

      const scrollTo = (_x: number, y: number, time = 0.3) => {
        const dom = contentRef.value!
        if (scrollY !== y) {
          scrollY = y
          if (time && !props.noAnimate) {
            setTransition(dom.style, `cubic-bezier(0,0,0.2,1.15) ${time}s`)
          }
          setTransform(dom.style, `translate3d(0,${-y}px,0)`)
          setTimeout(() => {
            scrollingComplete()
            if (dom) {
              setTransition(dom.style, '')
            }
          }, +time * 1000)
        }
      }

      const Velocity = ((minInterval = 30, maxInterval = 100) => {
        let _time = 0
        let _y = 0
        let _velocity = 0
        const recorder = {
          record: (y: number) => {
            const now = +new Date()
            _velocity = (y - _y) / (now - _time)
            if (now - _time >= minInterval) {
              _velocity = now - _time <= maxInterval ? _velocity : 0
              _y = y
              _time = now
            }
          },
          getVelocity: (y: number) => {
            if (y !== _y) {
              recorder.record(y)
            }
            return _velocity
          },
        }
        return recorder
      })()

      const onFinish = () => {
        isMoving = false
        let targetY = scrollY
        const children = slots.default!()
        const height = (children.length - 1) * itemHeight

        let time = 0.3

        const velocity = Velocity.getVelocity(targetY) * 4
        if (velocity) {
          targetY = velocity * 40 + targetY
          time = Math.abs(velocity) * 0.1
        }

        if (targetY % itemHeight !== 0) {
          targetY = Math.round(targetY / itemHeight) * itemHeight
        }

        if (targetY < 0) {
          targetY = 0
        } else if (targetY > height) {
          targetY = height
        }

        scrollTo(0, targetY, time < 0.3 ? 0.3 : time)
        onScrollChange()
      }

      const onStart = (y: number) => {
        if (scrollDisabled) {
          return
        }

        isMoving = true
        startY = y
        lastY = scrollY
      }

      const onMove = (y: number) => {
        if (scrollDisabled || !isMoving) {
          return
        }

        scrollY = lastY - y + startY
        Velocity.record(scrollY)

        onScrollChange()
        setTransform(contentRef.value!.style, `translate3d(0,${-scrollY}px,0)`)
      }

      return {
        touchstart: (evt: Events['onTouchstart']) => {
          onStart(evt.touches[0].pageY)
        },
        mousedown: (evt: Events['onMousedown']) => onStart(evt.pageY),
        touchmove: (evt: Events['onTouchstart']) => {
          evt.preventDefault()
          onMove(evt.touches[0].pageY)
        },
        mousemove: (evt: Events['onMousedown']) => {
          evt.preventDefault()
          onMove(evt.pageY)
        },
        touchend: () => onFinish(),
        touchcancel: () => onFinish(),
        mouseup: () => onFinish(),
        getValue: () => {
          return scrollY
        },
        scrollTo,
        setDisabled: (disabled: boolean = false) => {
          scrollDisabled = disabled
        },
      }
    })

    watch(
      () => props.selectedValue,
      (val) => {
        if (state.selectedValue !== val) {
          state.selectedValue = val
        }
        nextTick(() => {
          props.select?.(
            val,
            itemHeight,
            props.noAnimate ? scrollToWithoutAnimation : scrollTo
          )
        })
        scrollHanders.value.setDisabled(props.disabled)
      }
    )

    onUpdated(() => {
      props.select?.(state.selectedValue, itemHeight, scrollToWithoutAnimation)
    })

    onMounted(() => {
      const scrollHandersObj = scrollHanders.value
      type key = keyof typeof scrollHandersObj
      const rootHeight = rootRef.value?.getBoundingClientRect().height!
      // https://github.com/react-component/m-picker/issues/18
      itemHeight = indicatorRef.value?.getBoundingClientRect().height!
      let num = Math.floor(rootHeight / itemHeight)
      if (num % 2 === 0) {
        num--
      }
      num--
      num /= 2
      contentRef.value!.style.padding = `${itemHeight * num}px 0`
      indicatorRef.value!.style.top = `${itemHeight * num}px`
      maskRef.value!.style.backgroundSize = `100% ${itemHeight * num}px`
      scrollHandersObj.setDisabled(props.disabled)
      props.select?.(state.selectedValue, itemHeight, scrollTo)

      const passed = passiveSupported()
      const willPreventDefault = passed ? { passive: false } : false
      const willNotPreventDefault = passed ? { passive: true } : false
      Object.keys(scrollHandersObj).forEach((key) => {
        if (key.indexOf('touch') === 0 || key.indexOf('mouse') === 0) {
          const pd =
            key.indexOf('move') >= 0
              ? willPreventDefault
              : willNotPreventDefault
          rootRef.value?.addEventListener(
            key,
            (scrollHandersObj as any)[key],
            pd as any
          )
        }
      })
    })

    onUnmounted(() => {
      const obj = scrollHanders.value as any
      Object.keys(obj).forEach((key) => {
        if (key.indexOf('touch') === 0 || key.indexOf('mouse') === 0) {
          rootRef.value?.removeEventListener(key, obj[key])
        }
      })
    })

    function scrollTo(top: number) {
      scrollHanders.value.scrollTo(0, top)
    }

    function scrollToWithoutAnimation(top: number) {
      scrollHanders.value.scrollTo(0, top, 0)
    }

    function passiveSupported() {
      let passiveSupported = false

      try {
        const options = Object.defineProperty({}, 'passive', {
          get: () => {
            passiveSupported = true
          },
        })
        window.addEventListener('test', null as any, options)
      } catch (err) {}
      return passiveSupported
    }

    function onScrollChange() {
      const top = scrollHanders.value.getValue()
      if (top >= 0) {
        const children = slots.default?.()!
        const index = props.computeChildIndex(top, itemHeight, children.length)
        if (scrollValue !== index) {
          scrollValue = index
          const child = children[index]
          if (child) {
            emit('scrollChange', child.props?.value)
          } else if (!child && console.warn) {
            console.warn('child not found', children, index)
          }
        }
      }
    }

    function scrollingComplete() {
      const top = scrollHanders.value.getValue()
      if (top >= 0) {
        props.doScrollingComplete(top, itemHeight, fireValueChange)
      }
    }

    function fireValueChange(selectedValue: any) {
      if (selectedValue !== state.selectedValue) {
        if (!('selectedValue' in props)) {
          state.selectedValue = selectedValue
        }
        emit('valueChange', selectedValue)
      }
    }

    function getValue() {
      if ('selectedValue' in props) {
        return props.selectedValue
      }
      const children = slots.default?.()
      return children && children[0] && children[0]?.props?.value
    }

    return () => {
      const {
        prefixCls,
        itemStyle,
        indicatorStyle,
        indicatorClassName = '',
      } = props
      const { selectedValue } = state
      const itemclass = `${prefixCls}-item`
      const selectedItemclass = `${itemclass} ${prefixCls}-item-selected`
      const map = (item: VNode) => {
        const { class: cls = '', style, value } = item.props!
        return (
          <div
            style={{ ...itemStyle, ...style }}
            class={`${
              selectedValue === value ? selectedItemclass : itemclass
            } ${cls}`}
            key={value}
          >
            {item.children || item.props?.children}
          </div>
        )
      }
      const children = slots.default?.()
      // compatibility for preact
      const items = children
        ? children.map(map)
        : ([] as any[]).concat(children).map(map)

      return (
        <div class={prefixCls} ref={rootRef}>
          <div class={`${prefixCls}-mask`} ref={maskRef} />
          <div
            class={`${prefixCls}-indicator ${indicatorClassName}`}
            ref={indicatorRef}
            style={indicatorStyle}
          />
          <div class={`${prefixCls}-content`} ref={contentRef}>
            {items}
          </div>
        </div>
      )
    }
  },
})
export const PickerItem = (_props: IItemProps) => null

export default PickerMixin(Picker)
