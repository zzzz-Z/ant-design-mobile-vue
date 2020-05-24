import { MultiPicker, VCPicker, PickerItem } from 'packages/vc-picker'
import IDatePickerProps, { datePickerProps } from './IDatePickerProps'
import defaultLocale from './locale/en_US'
import { defineComponent, reactive, watch, getCurrentInstance } from 'vue'

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function pad(n: string | number) {
  return n < 10 ? `0${n}` : n + ''
}

function cloneDate(date: any) {
  return new Date(+date)
}

function setMonth(date: Date, month: number) {
  date.setDate(
    Math.min(
      date.getDate(),
      getDaysInMonth(new Date(date.getFullYear(), month))
    )
  )
  date.setMonth(month)
}

const DATETIME = 'datetime'
const DATE = 'date'
const TIME = 'time'
const MONTH = 'month'
const YEAR = 'year'
const ONE_DAY = 24 * 60 * 60 * 1000

const DatePicker = defineComponent<IDatePickerProps>({
  name: 'DatePicker',
  props: datePickerProps,
  setup(props, { slots }) {
    /**  ctx ---------------------- */
    const ctx = (getCurrentInstance() as any).ctx
    ctx.getValue = getValue
    /**  ctx ---------------------- */

    const state = reactive({
      date: props.date || props.defaultDate,
    })
    let defaultMinDate: any
    let defaultMaxDate: any
    watch(
      () => props.date,
      (val) => {
        state.date = val
      }
    )

    function clipDate(date: number | Date) {
      const { mode } = props
      const minDate = getMinDate()
      const maxDate = getMaxDate()
      if (mode === DATETIME) {
        if (date < minDate) {
          return cloneDate(minDate)
        }
        if (date > maxDate) {
          return cloneDate(maxDate)
        }
      } else if (mode === DATE || mode === YEAR || mode === MONTH) {
        // compare-two-dates: https://stackoverflow.com/a/14629978/2190503
        if (+date + ONE_DAY <= minDate) {
          return cloneDate(minDate)
        }
        if (date >= +maxDate + ONE_DAY) {
          return cloneDate(maxDate)
        }
      } else if (mode === TIME) {
        const maxHour = maxDate.getHours()
        const maxMinutes = maxDate.getMinutes()
        const minHour = minDate.getHours()
        const minMinutes = minDate.getMinutes()
        const hour = (date as Date).getHours()
        const minutes = (date as Date).getMinutes()
        if (hour < minHour || (hour === minHour && minutes < minMinutes)) {
          return cloneDate(minDate)
        }
        if (hour > maxHour || (hour === maxHour && minutes > maxMinutes)) {
          return cloneDate(maxDate)
        }
      }
      return date
    }

    function getNewDate(
      values: { [x: string]: string },
      index: string | number
    ) {
      const value = parseInt(values[index], 10)
      const { mode } = props
      let newValue = cloneDate(getDate())
      if (
        mode === DATETIME ||
        mode === DATE ||
        mode === YEAR ||
        mode === MONTH
      ) {
        switch (index) {
          case 0:
            newValue.setFullYear(value)
            break
          case 1:
            // Note: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth
            // e.g. from 2017-03-31 to 2017-02-28
            setMonth(newValue, value)
            break
          case 2:
            newValue.setDate(value)
            break
          case 3:
            setHours(newValue, value)
            break
          case 4:
            newValue.setMinutes(value)
            break
          case 5:
            setAmPm(newValue, value)
            break
          default:
            break
        }
      } else if (mode === TIME) {
        switch (index) {
          case 0:
            setHours(newValue, value)
            break
          case 1:
            newValue.setMinutes(value)
            break
          case 2:
            setAmPm(newValue, value)
            break
          default:
            break
        }
      }
      return clipDate(newValue)
    }

    function onValueChange(values: any, index: number) {
      const newValue = getNewDate(values, index)
      if (!('date' in props)) {
        state.date = newValue
      }
      if (props.onDateChange) {
        props.onDateChange(newValue)
      }
      if (props.onValueChange) {
        props.onValueChange(values, index)
      }
    }

    function onScrollChange(values?: any, index?: number) {
      if (props.onScrollChange) {
        const newValue = getNewDate(values, index!)
        props.onScrollChange(newValue, values, index!)
      }
    }

    function getDefaultMaxDate() {
      if (!defaultMaxDate) {
        defaultMaxDate = new Date(2030, 1, 1, 23, 59, 59)
      }
      return defaultMaxDate
    }

    function getDefaultMinDate() {
      if (!defaultMinDate) {
        defaultMinDate = new Date(2000, 1, 1, 0, 0, 0)
      }
      return defaultMinDate
    }

    function getDateData() {
      const { locale, formatMonth, formatDay, mode } = props
      const date = getDate() as Date
      const selYear = date.getFullYear()
      const selMonth = date.getMonth()
      const minDateYear = getMinYear()
      const maxDateYear = getMaxYear()
      const minDateMonth = getMinMonth()
      const maxDateMonth = getMaxMonth()
      const minDateDay = getMinDay()
      const maxDateDay = getMaxDay()
      const years: any[] = []
      for (let i = minDateYear; i <= maxDateYear; i++) {
        years.push({
          value: i + '',
          label: i + locale.year + '',
        })
      }
      const yearCol = {
        key: 'year',
        props: { children: years },
      }
      if (mode === YEAR) {
        return [yearCol]
      }

      const months: any[] = []
      let minMonth = 0
      let maxMonth = 11
      if (minDateYear === selYear) {
        minMonth = minDateMonth
      }
      if (maxDateYear === selYear) {
        maxMonth = maxDateMonth
      }
      for (let i = minMonth; i <= maxMonth; i++) {
        const label = formatMonth
          ? formatMonth(i, date)
          : i + 1 + locale.month + ''
        months.push({
          value: i + '',
          label,
        })
      }
      const monthCol = {
        key: 'month',
        props: { children: months },
      }
      if (mode === MONTH) {
        return [yearCol, monthCol]
      }

      const days: any[] = []
      let minDay = 1
      let maxDay = getDaysInMonth(date)

      if (minDateYear === selYear && minDateMonth === selMonth) {
        minDay = minDateDay
      }
      if (maxDateYear === selYear && maxDateMonth === selMonth) {
        maxDay = maxDateDay
      }
      for (let i = minDay; i <= maxDay; i++) {
        const label = formatDay ? formatDay(i, date) : i + locale.day + ''
        days.push({
          value: i + '',
          label,
        })
      }
      return [yearCol, monthCol, { key: 'day', props: { children: days } }]
    }

    function getDisplayHour(rawHour: number) {
      // 12 hour am (midnight 00:00) -> 12 hour pm (noon 12:00) -> 12 hour am (midnight 00:00)
      if (props.use12Hours) {
        if (rawHour === 0) {
          rawHour = 12
        }
        if (rawHour > 12) {
          rawHour -= 12
        }
        return rawHour
      }
      return rawHour
    }

    function getTimeData(date: Date) {
      let { minHour = 0, maxHour = 23, minMinute = 0, maxMinute = 59 } = props
      const { mode, locale, minuteStep, use12Hours } = props
      const minDateMinute = getMinMinute()
      const maxDateMinute = getMaxMinute()
      const minDateHour = getMinHour()
      const maxDateHour = getMaxHour()
      const hour = date.getHours()
      if (mode === DATETIME) {
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const minDateYear = getMinYear()
        const maxDateYear = getMaxYear()
        const minDateMonth = getMinMonth()
        const maxDateMonth = getMaxMonth()
        const minDateDay = getMinDay()
        const maxDateDay = getMaxDay()
        if (
          minDateYear === year &&
          minDateMonth === month &&
          minDateDay === day
        ) {
          minHour = minDateHour
          if (minDateHour === hour) {
            minMinute = minDateMinute
          }
        }
        if (
          maxDateYear === year &&
          maxDateMonth === month &&
          maxDateDay === day
        ) {
          maxHour = maxDateHour
          if (maxDateHour === hour) {
            maxMinute = maxDateMinute
          }
        }
      } else {
        minHour = minDateHour
        if (minDateHour === hour) {
          minMinute = minDateMinute
        }
        maxHour = maxDateHour
        if (maxDateHour === hour) {
          maxMinute = maxDateMinute
        }
      }

      const hours: any[] = []
      if (
        (minHour === 0 && maxHour === 0) ||
        (minHour !== 0 && maxHour !== 0)
      ) {
        minHour = getDisplayHour(minHour)
      } else if (minHour === 0 && use12Hours) {
        minHour = 1
        hours.push({
          value: '0',
          label: locale.hour ? '12' + locale.hour : '12',
        })
      }
      maxHour = getDisplayHour(maxHour)
      for (let i = minHour; i <= maxHour; i++) {
        hours.push({
          value: i + '',
          label: locale.hour ? i + locale.hour + '' : pad(i),
        })
      }

      const minutes: any[] = []
      const selMinute = date.getMinutes()
      for (let i = minMinute; i <= maxMinute; i += minuteStep!) {
        minutes.push({
          value: i + '',
          label: locale.minute ? i + locale.minute + '' : pad(i),
        })
        if (selMinute > i && selMinute < i + minuteStep!) {
          minutes.push({
            value: selMinute + '',
            label: locale.minute
              ? selMinute + locale.minute + ''
              : pad(selMinute),
          })
        }
      }
      const cols = [
        { key: 'hours', props: { children: hours } },
        {
          key: 'minutes',
          props: { children: minutes },
        },
      ].concat(
        use12Hours
          ? [
              {
                key: 'ampm',
                props: {
                  children: [
                    { value: '0', label: locale.am },
                    { value: '1', label: locale.pm },
                  ],
                },
              },
            ]
          : []
      )
      return { cols, selMinute }
    }

    function getValueCols() {
      const { mode, use12Hours } = props
      const date = getDate() as Date
      let cols: any[] = []
      let value: any[] = []

      if (mode === YEAR) {
        return {
          cols: getDateData(),
          value: [date.getFullYear() + ''],
        }
      }

      if (mode === MONTH) {
        return {
          cols: getDateData(),
          value: [date.getFullYear() + '', date.getMonth() + ''],
        }
      }

      if (mode === DATETIME || mode === DATE) {
        cols = getDateData()
        value = [
          date.getFullYear() + '',
          date.getMonth() + '',
          date.getDate() + '',
        ]
      }

      if (mode === DATETIME || mode === TIME) {
        const time = getTimeData(date)
        cols = cols.concat(time.cols)
        const hour = date.getHours()
        let dtValue = [hour + '', time.selMinute + '']
        let nhour = hour
        if (use12Hours) {
          nhour = hour > 12 ? hour - 12 : hour
          dtValue = [nhour + '', time.selMinute + '', (hour >= 12 ? 1 : 0) + '']
        }
        value = value.concat(dtValue)
      }
      return {
        value,
        cols,
      }
    }

    function getDate() {
      return clipDate(state.date || getDefaultMinDate())
    }

    // used by rmc-picker/lib/PopupMixin.js
    function getValue() {
      return getDate()
    }

    function getMinYear() {
      return getMinDate().getFullYear()
    }

    function getMaxYear() {
      return getMaxDate().getFullYear()
    }

    function getMinMonth() {
      return getMinDate().getMonth()
    }

    function getMaxMonth() {
      return getMaxDate().getMonth()
    }

    function getMinDay() {
      return getMinDate().getDate()
    }

    function getMaxDay() {
      return getMaxDate().getDate()
    }

    function getMinHour() {
      return getMinDate().getHours()
    }

    function getMaxHour() {
      return getMaxDate().getHours()
    }

    function getMinMinute() {
      return getMinDate().getMinutes()
    }

    function getMaxMinute() {
      return getMaxDate().getMinutes()
    }

    function getMinDate() {
      return props.minDate || getDefaultMinDate()
    }

    function getMaxDate() {
      return props.maxDate || getDefaultMaxDate()
    }

    function setHours(date: Date, hour: number) {
      if (props.use12Hours) {
        const dh = date.getHours()
        let nhour = hour
        nhour = dh >= 12 ? hour + 12 : hour
        nhour = nhour >= 24 ? 0 : nhour // Make sure no more than one day
        date.setHours(nhour)
      } else {
        date.setHours(hour)
      }
    }

    function setAmPm(date: Date, index: number) {
      if (index === 0) {
        date.setTime(+date - ONE_DAY / 2)
      } else {
        date.setTime(+date + ONE_DAY / 2)
      }
    }

    return () => {
      const { value, cols } = getValueCols()
      const {
        disabled,
        pickerPrefixCls,
        prefixCls,
        rootNativeProps,
        itemStyle,
      } = props

      return (
        <MultiPicker
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          rootNativeProps={rootNativeProps}
          prefixCls={prefixCls}
          selectedValue={value}
          onValueChange={onValueChange}
          onScrollChange={onScrollChange}
        >
          {cols.map((p) => (
            <VCPicker
              style={{ flex: 1 }}
              key={p.key}
              disabled={disabled}
              prefixCls={pickerPrefixCls}
              itemStyle={itemStyle}
            >
              {p.props.children.map((item: any) => (
                <PickerItem
                  children={item.label}
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </PickerItem>
              ))}
            </VCPicker>
          ))}
        </MultiPicker>
      )
    }
  },
})

export default DatePicker
