import { VCDatePicker } from 'packages/vc-date-picker'
import { FunctionalComponent } from 'vue'
import { Locale } from './date/DataTypes'

export interface PropsType {
  locale: Locale
  prefixCls?: string
  pickerPrefixCls?: string
  title?: string
  defaultValue?: Date
  value?: Date
  onValueChange?: (time: Date) => void

  minDate?: Date
  maxDate?: Date
  clientHeight?: number
}
export interface StateType {}

const defaultProps = {
  minDate: new Date(0, 0, 0, 0, 0),
  maxDate: new Date(9999, 11, 31, 23, 59, 59),
  defaultValue: new Date(2000, 1, 1, 8),
}

function getMinTime(minDate: Date, date?: Date) {
  if (
    !date ||
    date.getFullYear() > minDate.getFullYear() ||
    date.getMonth() > minDate.getMonth() ||
    date.getDate() > minDate.getDate()
  ) {
    return defaultProps.minDate
  }
  return minDate
}

function getMaxTime(maxDate: Date, date?: Date) {
  if (
    !date ||
    date.getFullYear() < maxDate.getFullYear() ||
    date.getMonth() < maxDate.getMonth() ||
    date.getDate() < maxDate.getDate()
  ) {
    return defaultProps.maxDate
  }
  return maxDate
}

const TimePicker: FunctionalComponent<PropsType> = (props) => {
  const {
    minDate = new Date(0, 0, 0, 0, 0),
    maxDate = new Date(9999, 11, 31, 23, 59, 59),
    defaultValue = new Date(2000, 1, 1, 8),
    locale,
    title,
    value,
    prefixCls,
    pickerPrefixCls,
    clientHeight,
    onValueChange,
  } = props
  const date = value || defaultValue || undefined
  const height =
    (clientHeight && (clientHeight * 3) / 8 - 52) || Number.POSITIVE_INFINITY

  return (
    <div class="time-picker">
      <div class="title">{title}</div>
      <VCDatePicker
        prefixCls={prefixCls}
        pickerPrefixCls={pickerPrefixCls}
        style={{
          height: height > 164 || height < 0 ? 164 : height,
          overflow: 'hidden',
        }}
        mode="time"
        date={date}
        locale={locale}
        minDate={getMinTime(minDate, date)}
        maxDate={getMaxTime(maxDate, date)}
        onDateChange={(v) => onValueChange?.(v)}
        use12Hours
      />
    </div>
  )
}

export default TimePicker
