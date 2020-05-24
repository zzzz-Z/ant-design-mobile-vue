import PropsType from './DatePickerProps'
import { formatDate } from './util'
import { reactive, watch, onMounted, getCurrentInstance } from 'vue'
import SingleMonth from './date/SingleMonth'
import { MonthData, CellData, Locale, SelectType } from './date/DataTypes'

export default function useBaseDatePicker() {
  const { emit, update } = getCurrentInstance()!
  const props = getCurrentInstance()!.props as PropsType
  const months = reactive<MonthData[]>([])

  let visibleMonth: MonthData[] = []
  onMounted(() => {
    const { initalMonths = 6, defaultDate } = props
    for (let i = 0; i < initalMonths; i++) {
      canLoadNext() && genMonthData(defaultDate, i)
    }
    visibleMonth = [...months]
  })

  onMounted(() => {})

  watch(
    [() => props.startDate, () => props.endDate],
    ([sd, ed], [oldSd, oldEd]) => {
      if (oldSd !== sd || oldEd !== ed) {
        if (oldSd) {
          selectDateRange(oldSd, oldEd, true)
        }
        if (sd) {
          selectDateRange(sd, ed)
        }
      }
    }
  )

  function computeVisible(clientHeight: number, scrollTop: number) {
    let needUpdate = false
    const MAX_VIEW_PORT = clientHeight * 2
    const MIN_VIEW_PORT = clientHeight

    // 大缓冲区外过滤规则
    const filterFunc = (vm: MonthData) =>
      vm.y &&
      vm.height &&
      vm.y + vm.height > scrollTop - MAX_VIEW_PORT &&
      vm.y < scrollTop + clientHeight + MAX_VIEW_PORT

    if (props.infiniteOpt && visibleMonth.length > 12) {
      visibleMonth = visibleMonth
        .filter(filterFunc)
        .sort((a, b) => +a.firstDate - +b.firstDate)
    }

    // 当小缓冲区不满时填充
    if (visibleMonth.length > 0) {
      const last = visibleMonth[visibleMonth.length - 1]
      if (
        last.y !== undefined &&
        last.height &&
        last.y + last.height < scrollTop + clientHeight + MIN_VIEW_PORT
      ) {
        const lastIndex = months.indexOf(last)
        for (let i = 1; i <= 2; i++) {
          const index = lastIndex + i
          if (
            index < months.length &&
            visibleMonth.indexOf(months[index]) < 0
          ) {
            visibleMonth.push(months[index])
          } else {
            canLoadNext() && genMonthData(undefined, 1)
          }
        }
        needUpdate = true
      }

      const first = visibleMonth[0]
      if (
        first.y !== undefined &&
        first.height &&
        first.y > scrollTop - MIN_VIEW_PORT
      ) {
        const firstIndex = months.indexOf(first)
        for (let i = 1; i <= 2; i++) {
          const index = firstIndex - i
          if (index >= 0 && visibleMonth.indexOf(months[index]) < 0) {
            visibleMonth.unshift(months[index])
            needUpdate = true
          }
        }
      }
    } else if (months.length > 0) {
      visibleMonth = months.filter(filterFunc)
      needUpdate = true
    }

    return needUpdate
  }

  function onCellClick(day: CellData) {
    if (!day.tick) return
    emit('cellClick', new Date(day.tick))
  }

  function createOnScroll() {
    let timer: any
    let clientHeight = 0,
      scrollTop = 0

    return (data: { full: number; client: number; top: number }) => {
      const { client, top } = data
      clientHeight = client
      scrollTop = top

      if (timer) {
        return
      }

      timer = setTimeout(() => {
        timer = undefined
        if (computeVisible(clientHeight, scrollTop)) {
          // forceUpdate();
          update()
        }
      }, 64)
    }
  }

  function computeHeight(
    data: MonthData,
    singleMonth: typeof SingleMonth | null
  ) {
    if (singleMonth && singleMonth.wrapperDivDOM) {
      // preact, ref时dom有可能无height, offsetTop数据。
      if (!data.height && !singleMonth.wrapperDivDOM.clientHeight) {
        setTimeout(() => computeHeight(data, singleMonth), 500)
        return
      }
      data.height = singleMonth.wrapperDivDOM.clientHeight || data.height || 0
      data.y = singleMonth.wrapperDivDOM.offsetTop || data.y || 0
    }
  }

  function genMonthComponent(data?: MonthData) {
    if (!data) return
    return (
      <SingleMonth
        key={data.title}
        locale={props.locale || ({} as Locale)}
        monthData={data}
        rowSize={props.rowSize}
        onCellClick={onCellClick}
        getDateExtra={props.getDateExtra}
        onVnodeMounted={({ component }) => {
          const dom = (component as any).ctx || data.componentRef || undefined
          data.componentRef = dom
          data.updateLayout = () => computeHeight(data, dom)
          data.updateLayout()
        }}
      />
    )
  }
  function canLoadPrev() {
    const { minDate } = props
    return (
      !minDate ||
      months.length <= 0 ||
      +getMonthDate(minDate).firstDate < +months[0].firstDate
    )
  }

  function genMonthData(date?: Date, addMonth: number = 0) {
    if (!date) {
      date =
        addMonth >= 0
          ? months[months.length - 1].firstDate
          : months[0].firstDate
    }
    if (!date) {
      date = new Date()
    }
    const { startDate, endDate, locale } = props
    const { firstDate, lastDate } = getMonthDate(date, addMonth)

    const weeks = genWeekData(firstDate)
    const title = formatDate(
      firstDate,
      locale ? locale.monthTitle : 'yyyy/MM',
      props.locale
    )
    const data = reactive<MonthData>({
      title,
      firstDate,
      lastDate,
      weeks,
    })

    data.component = genMonthComponent(data)
    if (addMonth >= 0) {
      months.push(data)
    } else {
      months.unshift(data)
    }
    if (startDate) {
      selectDateRange(startDate, endDate)
    }
    return data
  }

  function genWeekData(firstDate: Date) {
    const minDateTime = getDateWithoutTime(props.minDate)
    const maxDateTime =
      getDateWithoutTime(props.maxDate) || Number.POSITIVE_INFINITY

    const weeks: CellData[][] = []
    const nextMonth = getMonthDate(firstDate, 1).firstDate
    let currentDay = firstDate
    let currentWeek: CellData[] = []
    weeks.push(currentWeek)

    let startWeekday = currentDay.getDay()
    if (startWeekday > 0) {
      for (let i = 0; i < startWeekday; i++) {
        currentWeek.push({} as CellData)
      }
    }
    while (currentDay < nextMonth) {
      if (currentWeek.length === 7) {
        currentWeek = []
        weeks.push(currentWeek)
      }
      const dayOfMonth = currentDay.getDate()
      const tick = +currentDay
      currentWeek.push({
        tick,
        dayOfMonth,
        selected: SelectType.None,
        isFirstOfMonth: dayOfMonth === 1,
        isLastOfMonth: false,
        outOfDate: tick < minDateTime || tick > maxDateTime,
      })
      currentDay = new Date(currentDay.getTime() + 3600 * 24 * 1000)
    }
    currentWeek[currentWeek.length - 1].isLastOfMonth = true
    return weeks
  }

  function canLoadNext() {
    const { maxDate } = props
    return (
      !maxDate ||
      months.length <= 0 ||
      +getMonthDate(maxDate).firstDate > +months[months.length - 1].firstDate
    )
  }

  function getMonthDate(date = new Date(), addMonth = 0) {
    const y = date.getFullYear(),
      m = date.getMonth()
    return {
      firstDate: new Date(y, m + addMonth, 1),
      lastDate: new Date(y, m + 1 + addMonth, 0),
    }
  }

  function getDateWithoutTime(date?: Date) {
    if (!date) return 0
    return +new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  function inDate(date: number, tick: number) {
    return date <= tick && tick < date + 24 * 3600000
  }

  function selectDateRange(startDate: Date, endDate?: Date, clear = false) {
    const { getDateExtra, type, onSelectHasDisableDate } = props
    if (type === 'one') {
      endDate = undefined
    }
    const time1 = getDateWithoutTime(startDate)
    const time2 = getDateWithoutTime(endDate)
    const startDateTick = !time2 || time1 < time2 ? time1 : time2
    const endDateTick = time2 && time1 > time2 ? time1 : time2

    const startMonthDate = getMonthDate(new Date(startDateTick)).firstDate
    const endMonthDate = endDateTick
      ? new Date(endDateTick)
      : getMonthDate(new Date(startDateTick)).lastDate

    let unuseable: number[] = []
    let needUpdate = false

    months
      .filter((m) => {
        return m.firstDate >= startMonthDate && m.firstDate <= endMonthDate
      })
      .forEach((m) => {
        m.weeks.forEach((w) =>
          w
            .filter((d) => {
              if (!endDateTick) {
                return d.tick && inDate(startDateTick, d.tick)
              } else {
                return (
                  d.tick && d.tick >= startDateTick && d.tick <= endDateTick
                )
              }
            })
            .forEach((d) => {
              const oldValue = d.selected
              if (clear) {
                d.selected = SelectType.None
              } else {
                const info =
                  (getDateExtra && getDateExtra(new Date(d.tick))) || {}
                if (d.outOfDate || info.disable) {
                  unuseable.push(d.tick)
                }
                if (inDate(startDateTick, d.tick)) {
                  if (type === 'one') {
                    d.selected = SelectType.Single
                  } else if (!endDateTick) {
                    d.selected = SelectType.Only
                  } else if (startDateTick !== endDateTick) {
                    d.selected = SelectType.Start
                  } else {
                    d.selected = SelectType.All
                  }
                } else if (inDate(endDateTick, d.tick)) {
                  d.selected = SelectType.End
                } else {
                  d.selected = SelectType.Middle
                }
              }
              needUpdate = needUpdate || d.selected !== oldValue
            })
        )
        if (needUpdate && m.componentRef) {
          m.componentRef.updateWeeks()
          m.componentRef.$forceUpdate?.()
        }
      })
    if (unuseable.length > 0) {
      if (onSelectHasDisableDate) {
        onSelectHasDisableDate(unuseable.map((tick) => new Date(tick)))
      } else {
        console.warn(
          'Unusable date. You can handle by onSelectHasDisableDate.',
          unuseable
        )
      }
    }
  }
  return {
    visibleMonth,
    months,
    computeVisible,
    canLoadNext,
    genWeekData,
    genMonthData,
    canLoadPrev,
    getMonthDate,
    getDateWithoutTime,
    inDate,
    update,
    selectDateRange,
    createOnScroll,
    onCellClick,
  }
}
