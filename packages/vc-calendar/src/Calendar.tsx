import TimePicker from './TimePicker'
import DatePicker from './DatePicker'
import ConfirmPanel from './calendar/ConfirmPanel'
import ShortcutPanel from './calendar/ShortcutPanel'
import AnimateWrapper from './calendar/AnimateWrapper'
import Header from './calendar/Header'
import { CalendarPropsType, calendarProps } from './CalendarProps'
import { mergeDateTime } from './util'
import { defineComponent, reactive, watch, Transition } from 'vue'
import { Locale } from './date/DataTypes'
import getTransitionProps from 'packages/utils/getTransitionProps'
import { withVshow } from 'packages/utils/directives'

export class StateTypes {
  showTimePicker: boolean = false
  timePickerTitle?: string
  startDate?: Date = undefined
  endDate?: Date = undefined
  disConfirmBtn?: boolean = true
  clientHight?: number = 0
}

export default defineComponent<CalendarPropsType>({
  props: calendarProps,
  setup(props) {
    let state = reactive(new StateTypes())
    if (props.defaultValue) {
      const defaultValue = props.defaultValue!
      setState(
        selectDate(defaultValue[1]!, true, { startDate: defaultValue[0] })
      )
    }

    watch(
      () => props.defaultValue,
      (val) => {
        if (val && props.visible) {
          const [a, b] = val!
          shortcutSelect(a, b!)
        }
      }
    )

    function selectDate(
      date: Date,
      useDateTime = false,
      oldState: { startDate?: Date; endDate?: Date } = {}
    ) {
      if (!date) return {} as StateTypes
      let newState = {} as StateTypes
      const { type, pickTime, defaultTimeValue, locale = {} as Locale } = props
      const newDate =
        pickTime && !useDateTime ? mergeDateTime(date, defaultTimeValue) : date
      const { startDate, endDate } = oldState

      switch (type) {
        case 'one':
          newState = {
            ...newState,
            startDate: newDate,
            disConfirmBtn: false,
          }
          if (pickTime) {
            newState = {
              ...newState,
              timePickerTitle: locale.selectTime,
              showTimePicker: true,
            }
          }
          break

        case 'range':
          if (!startDate || endDate) {
            newState = {
              ...newState,
              startDate: newDate,
              endDate: undefined,
              disConfirmBtn: true,
            }
            if (pickTime) {
              newState = {
                ...newState,
                timePickerTitle: locale.selectStartTime,
                showTimePicker: true,
              }
            }
          } else {
            newState = {
              ...newState,
              timePickerTitle:
                +newDate >= +startDate
                  ? locale.selectEndTime
                  : locale.selectStartTime,
              disConfirmBtn: false,
              endDate:
                pickTime && !useDateTime && +newDate >= +startDate
                  ? new Date(+mergeDateTime(newDate, startDate) + 3600000)
                  : newDate,
            }
          }
          break
      }
      return newState
    }

    function shortcutSelect(startDate?: Date, endDate?: Date) {
      setState({
        startDate,
        ...selectDate(endDate!, true, { startDate }),
        showTimePicker: false,
      })
    }

    function setState(newState: any) {
      Object.keys(newState).forEach((key) => {
        ;(state as any)[key] = newState[key]
      })
    }
    function onSelectedDate(date: Date) {
      const { startDate, endDate } = state
      const { onSelect } = props
      if (onSelect) {
        let value = onSelect(date, [startDate, endDate])
        if (value) {
          shortcutSelect(value[0], value[1]!)
          return
        }
      }
      setState(selectDate(date, false, { startDate, endDate }))
    }

    function onClear() {
      state.startDate = undefined
      state.endDate = undefined
      state.showTimePicker = false
      props.onClear?.()
    }

    function onSelectHasDisableDate(date: Date[]) {
      onClear()
      props.onSelectHasDisableDate?.(date)
    }

    function onClose() {
      setState(new StateTypes())
    }

    function onCancel() {
      props.onCancel?.()
      onClose()
    }

    function onConfirm() {
      let { startDate, endDate } = state
      if (startDate && endDate && +startDate > +endDate) {
        return props.onConfirm?.(endDate, startDate)
      }
      props.onConfirm?.(startDate, endDate)
      onClose()
    }

    function onTimeChange(date: Date) {
      const { startDate, endDate } = state
      if (endDate) {
        state.endDate = date
      } else if (startDate) {
        state.startDate = date
      }
    }

    function setClientHeight(height: number) {
      state.clientHight = height
    }

    return () => {
      const {
        type,
        locale = {} as Locale,
        prefixCls,
        visible,
        pickTime,
        showShortcut,
        renderHeader,
        infiniteOpt,
        initalMonths,
        defaultDate,
        minDate,
        maxDate,
        getDateExtra,
        rowSize,
        title,
        defaultTimeValue,
        renderShortcut,
        enterDirection,
        timePickerPrefixCls,
        timePickerPickerPrefixCls,
      } = props
      const {
        showTimePicker,
        timePickerTitle,
        startDate,
        endDate,
        disConfirmBtn,
        clientHight,
      } = state
      const headerProps = {
        locale,
        title,
        showClear: !!startDate,
        onCancel: onCancel,
        onClear: onClear,
      }

      const content = (
        <AnimateWrapper class="content">
          {renderHeader?.(headerProps) || <Header {...headerProps} />}
          <DatePicker
            locale={locale}
            type={type}
            prefixCls={prefixCls}
            infiniteOpt={infiniteOpt}
            initalMonths={initalMonths}
            defaultDate={defaultDate}
            minDate={minDate}
            maxDate={maxDate}
            getDateExtra={getDateExtra}
            onCellClick={onSelectedDate}
            onSelectHasDisableDate={onSelectHasDisableDate}
            onLayout={setClientHeight}
            startDate={startDate}
            endDate={endDate}
            rowSize={rowSize}
          />
          {showTimePicker && (
            <TimePicker
              prefixCls={timePickerPrefixCls}
              pickerPrefixCls={timePickerPickerPrefixCls}
              locale={locale}
              title={timePickerTitle}
              defaultValue={defaultTimeValue}
              value={endDate ? endDate : startDate}
              onValueChange={onTimeChange}
              minDate={minDate}
              maxDate={maxDate}
              clientHeight={clientHight}
            />
          )}
          {showShortcut &&
            !showTimePicker &&
            (renderShortcut ? (
              renderShortcut(shortcutSelect)
            ) : (
              <ShortcutPanel locale={locale} onSelect={shortcutSelect} />
            ))}
          {startDate && (
            <ConfirmPanel
              type={type}
              locale={locale}
              startDateTime={startDate}
              endDateTime={endDate}
              onConfirm={onConfirm}
              disableBtn={disConfirmBtn}
              formatStr={pickTime ? locale.dateTimeFormat : locale.dateFormat}
            />
          )}
        </AnimateWrapper>
      )
      const contentTrsProps = getTransitionProps(
        enterDirection === 'horizontal' ? 'slideH' : 'slideV'
      )
      return (
        <div class={`${prefixCls}`}>
          <Transition {...getTransitionProps('fade')}>
            {withVshow((<AnimateWrapper class="mask" />) as any, visible)}
          </Transition>
          <Transition {...contentTrsProps}>
            {withVshow(content as any, visible)}
          </Transition>
        </div>
      )
    }
  },
})
