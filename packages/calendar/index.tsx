import { Calendar as RMCalendar } from '../vc-calendar'
import Header from '../vc-calendar/src/calendar/Header'
import Icon from '../icon'
import { CalendarProps } from './PropsType'
import { defineComponent } from 'vue'
import { useLocale } from '../utils/useLocale'

export default defineComponent<CalendarProps>({
  name: 'Calendar',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const defaultProps = {
      // prefixCls: 'am-calendar',
      // timePickerPrefixCls: 'am-picker',
      // timePickerPickerPrefixCls: 'am-picker-col',
    }
    const { getLocale } = useLocale('Calendar', () => require('./locale/zh_CN'))
    return () => (
      <RMCalendar
        locale={getLocale()}
        renderHeader={(headerProps) => (
          <Header {...headerProps} closeIcon={<Icon type="cross" />} />
        )}
        {...{ ...defaultProps, ...attrs }}
      >
        {slots.default?.()}
      </RMCalendar>
    )
  },
})
