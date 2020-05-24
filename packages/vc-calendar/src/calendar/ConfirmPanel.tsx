import { formatDate } from '../util'
import { FunctionalComponent, Events } from 'vue'
import { Locale } from '../date/DataTypes'

export interface ConfirmPanelPropsType {
  type?: 'one' | 'range'
  locale: Locale
  onlyConfirm?: boolean
  disableBtn?: boolean
  startDateTime?: Date
  endDateTime?: Date
  formatStr?: string
  onConfirm: () => void
}

function onConfirm(e: Events['onClick'], props: ConfirmPanelPropsType) {
  const { onConfirm, disableBtn } = props
  !disableBtn && onConfirm()
}

function _formatDate(props: ConfirmPanelPropsType, date: Date) {
  const { formatStr = 'yyyy-MM-dd hh:mm', locale } = props
  return formatDate(date, formatStr, locale)
}

const ConfirmPanel: FunctionalComponent<ConfirmPanelPropsType> = (props) => {
  const { type, locale, disableBtn } = props
  let { startDateTime, endDateTime } = props
  if (startDateTime && endDateTime && +startDateTime > +endDateTime) {
    const tmp = startDateTime
    startDateTime = endDateTime
    endDateTime = tmp
  }

  const startTimeStr = startDateTime
    ? _formatDate(props, startDateTime)
    : locale.noChoose
  const endTimeStr = endDateTime
    ? _formatDate(props, endDateTime)
    : locale.noChoose
  let btnCls = disableBtn ? 'button button-disable' : 'button'
  if (type === 'one') {
    btnCls += ' button-full'
  }

  return (
    <div class="confirm-panel">
      {type === 'range' && (
        <div class="info">
          <p>
            {locale.start}:
            <span class={!startDateTime ? 'grey' : ''}>{startTimeStr}</span>
          </p>
          <p>
            {locale.end}:
            <span class={!endDateTime ? 'grey' : ''}>{endTimeStr}</span>
          </p>
        </div>
      )}
      <div class={btnCls} onClick={(e) => onConfirm(e, props)}>
        {locale.confirm}
      </div>
    </div>
  )
}

ConfirmPanel.displayName = 'ConfirmPanel'

export default ConfirmPanel
