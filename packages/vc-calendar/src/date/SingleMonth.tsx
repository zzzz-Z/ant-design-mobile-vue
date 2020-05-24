import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  watch,
  getCurrentInstance,
} from 'vue'
import { defineProps } from 'packages/_util/vue-types/defineProps'
import { Locale, MonthData, ExtraData, CellData, SelectType } from './DataTypes'
export interface PropsType {
  locale: Locale
  monthData: MonthData
  rowSize?: 'normal' | 'xl'
  getDateExtra?: (date: Date) => ExtraData
  onCellClick?: (data: CellData, monthData: MonthData) => void
}

export default defineComponent<PropsType>({
  name: 'SingleMonth',
  props: defineProps({
    locale: undefined,
    monthData: undefined,
    rowSize: String,
    getDateExtra: Function,
  }),
  setup(props, { emit }) {
    const weekComponents = reactive<any[]>([])
    const wrapperDivDOM = ref<HTMLDivElement | null>(null)
    const { ctx } = getCurrentInstance() as any
    ctx.updateWeeks = updateWeeks
    ctx.wrapperDivDOM = wrapperDivDOM
    watch(() => props.monthData, updateWeeks)
    onMounted(() => {
      props.monthData.weeks.forEach((week, index) => genWeek(week, index))
    })

    function genWeek(weeksData: CellData[], index: number) {
      const { getDateExtra, monthData, locale, rowSize } = props
      let rowCls = 'row'
      if (rowSize === 'xl') {
        rowCls += ' row-xl'
      }
      weekComponents[index] = (
        <div key={index} class={rowCls}>
          {weeksData.map((day, dayOfWeek) => {
            const extra =
              (getDateExtra && getDateExtra(new Date(day.tick))) || {}
            let info = extra.info
            const disable = extra.disable || day.outOfDate
            let cls = 'date'
            let lCls = 'left'
            let rCls = 'right'
            let infoCls = 'info'

            if (dayOfWeek === 0 || dayOfWeek === 6) {
              cls += ' grey'
            }

            if (disable) {
              cls += ' disable'
            } else if (info) {
              cls += ' important'
            }

            if (day.selected) {
              cls += ' date-selected'
              let styleType = day.selected
              switch (styleType) {
                case SelectType.Only:
                  info = locale.begin
                  infoCls += ' date-selected'
                  break
                case SelectType.All:
                  info = locale.begin_over
                  infoCls += ' date-selected'
                  break

                case SelectType.Start:
                  info = locale.begin
                  infoCls += ' date-selected'
                  if (dayOfWeek === 6 || day.isLastOfMonth) {
                    styleType = SelectType.All
                  }
                  break
                case SelectType.Middle:
                  if (dayOfWeek === 0 || day.isFirstOfMonth) {
                    if (day.isLastOfMonth || dayOfWeek === 6) {
                      styleType = SelectType.All
                    } else {
                      styleType = SelectType.Start
                    }
                  } else if (dayOfWeek === 6 || day.isLastOfMonth) {
                    styleType = SelectType.End
                  }
                  break
                case SelectType.End:
                  info = locale.over
                  infoCls += ' date-selected'
                  if (dayOfWeek === 0 || day.isFirstOfMonth) {
                    styleType = SelectType.All
                  }
                  break
              }

              switch (styleType) {
                case SelectType.Single:
                case SelectType.Only:
                case SelectType.All:
                  cls += ' selected-single'
                  break
                case SelectType.Start:
                  cls += ' selected-start'
                  rCls += ' date-selected'
                  break
                case SelectType.Middle:
                  cls += ' selected-middle'
                  lCls += ' date-selected'
                  rCls += ' date-selected'
                  break
                case SelectType.End:
                  cls += ' selected-end'
                  lCls += ' date-selected'
                  break
              }
            }
            const defaultContent = [
              <div key="wrapper" class="date-wrapper">
                <span class={lCls}></span>
                <div class={cls}>{day.dayOfMonth}</div>
                <span class={rCls}></span>
              </div>,
              <div key="info" class={infoCls}>
                {info}
              </div>,
            ]

            return (
              <div
                key={dayOfWeek}
                class={`cell ${extra.cellCls || ''}`}
                onClick={() => {
                  console.log(disable)

                  !disable && emit('cellClick', day, monthData)
                }}
              >
                {extra.cellRender
                  ? extra.cellRender(new Date(day.tick))
                  : defaultContent}
              </div>
            )
          })}
        </div>
      )
    }

    function updateWeeks(monthData?: MonthData) {
      ;(monthData || props.monthData).weeks.forEach((week, index) => {
        genWeek(week, index)
      })
    }

    return () => {
      const { title } = props.monthData

      return (
        <div class="single-month" ref={wrapperDivDOM}>
          <div class="month-title">{title}</div>
          <div class="date">{weekComponents.map((node) => node)}</div>
        </div>
      )
    }
  },
})
