import PropsType from './DatePickerProps'
import useBaseDatePicker from './DatePicker.base'
import WeekPanel from './date/WeekPanel'
import { defineComponent, ref, onMounted } from 'vue'
import { defineProps } from 'packages/_util/vue-types/defineProps'
import defaultLocale from './locale/zh_CN'
import { Locale } from './date/DataTypes'

const DatePicker = defineComponent<PropsType>({
  name: 'DatePicker',
  props: defineProps({
    prefixCls: 'rmc-calendar',
    infinite: false,
    infiniteOpt: false,
    defaultDate: new Date(),
    initalMonths: 6,
    locale: defaultLocale,
    startDate: Date,
    endDate: Date,
    getDateExtra: Function,
    maxDate: Date,
    minDate: Date,
    onCellClick: Function,
    onLayout: Function,
    onSelectHasDisableDate: Function,
    rowSize: String,
    type: String,
  }),
  setup(props) {
    const base = useBaseDatePicker()
    const panel = ref<HTMLDivElement | null>(null)
    const wrapperRef = ref<HTMLDivElement | null>(null)
    let transform: string = ''

    onMounted(() => {
      const dom = wrapperRef.value!
      if (dom) {
        const { onLayout } = props
        onLayout && onLayout(dom.clientHeight)

        const scrollHandler = base.createOnScroll()
        dom.onscroll = (evt) => {
          scrollHandler({
            client: dom.clientHeight,
            full: (evt.currentTarget as HTMLDivElement).clientHeight,
            top: (evt.currentTarget as HTMLDivElement).scrollTop,
          })
        }
      }
    })

    const touchHandler = (() => {
      const initDelta = 0
      let lastY = 0
      let delta = initDelta

      return {
        onTouchStart: (evt: TouchEvent) => {
          lastY = evt.touches[0].screenY
          delta = initDelta
        },
        onTouchMove: (evt: TouchEvent) => {
          const ele = evt.currentTarget
          const isReachTop = (ele as any).scrollTop === 0

          if (isReachTop) {
            delta = evt.touches[0].screenY - lastY
            if (delta > 0) {
              evt.preventDefault()
              if (delta > 80) {
                delta = 80
              }
            } else {
              delta = 0
            }
            setTransform(panel.value!.style, `translate3d(0,${delta}px,0)`)
          }
        },

        onTouchEnd: () => {
          touchHandler.onFinish()
        },

        onTouchCancel: () => {
          touchHandler.onFinish()
        },

        onFinish: () => {
          if (delta > 40 && base.canLoadPrev()) {
            base.genMonthData(base.months[0].firstDate, -1)

            base.visibleMonth = base.months.slice(0, props.initalMonths)

            base.months.forEach((m) => {
              m.updateLayout && m.updateLayout()
            })
            base.update()
          }
          setTransform(panel.value!.style, `translate3d(0,0,0)`)
          setTransition(panel.value!.style, '.3s')
          setTimeout(() => {
            panel.value && setTransition(panel.value.style, '')
          }, 300)
        },
      }
    })()

    function setTransform(nodeStyle: CSSStyleDeclaration, value: any) {
      transform = value
      nodeStyle.transform = value
      nodeStyle.webkitTransform = value
    }

    function setTransition(nodeStyle: CSSStyleDeclaration, value: any) {
      nodeStyle.transition = value
      nodeStyle.webkitTransition = value
    }

    return () => {
      const { prefixCls = '', locale = {} as Locale } = props
      const style = { transform }

      return (
        <div class={`${prefixCls} date-picker`}>
          <WeekPanel locale={locale} />
          <div
            class="wrapper"
            style={{ overflowX: 'hidden', overflowY: 'visible' }}
            ref={wrapperRef}
            onTouchstart={touchHandler.onTouchStart}
            onTouchmove={touchHandler.onTouchMove}
            onTouchend={touchHandler.onTouchEnd}
            onTouchcancel={touchHandler.onTouchCancel}
          >
            <div style={style} ref={panel}>
              {base.canLoadPrev() && (
                <div class="load-tip">{locale.loadPrevMonth}</div>
              )}
              <div class="months">
                {base.months.map((m) => {
                  const hidden = m.height && base.visibleMonth.indexOf(m) < 0
                  if (hidden) {
                    return (
                      <div
                        key={m.title + '_shallow'}
                        style={{ height: m.height }}
                      />
                    )
                  }
                  return m.component
                })}
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})

export default DatePicker
