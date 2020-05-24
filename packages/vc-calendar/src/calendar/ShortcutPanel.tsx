import { FunctionalComponent } from 'vue'
import { Locale } from '../date/DataTypes'

export interface PropsType {
  locale: Locale
  onSelect: (startDate?: Date, endDate?: Date) => void
}

function invok(props: PropsType) {
  return (type: string) => {
    const { onSelect } = props
    const today = new Date()

    switch (type) {
      case 'today':
        onSelect(
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0),
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
        )
        break

      case 'yesterday':
        onSelect(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 1,
            0
          ),
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 1,
            12
          )
        )
        break

      case 'lastweek':
        onSelect(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 6,
            0
          ),
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
        )
        break

      case 'lastmonth':
        onSelect(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 29,
            0
          ),
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12)
        )
        break
    }
  }
}

const ShortcutPanel: FunctionalComponent<PropsType> = (props) => {
  const { locale } = props
  const click = invok(props)
  return (
    <div class="shortcut-panel">
      <div class="item" onClick={() => click('today')}>
        {locale.today}
      </div>
      <div class="item" onClick={() => click('yesterday')}>
        {locale.yesterday}
      </div>
      <div class="item" onClick={() => click('lastweek')}>
        {locale.lastWeek}
      </div>
      <div class="item" onClick={() => click('lastmonth')}>
        {locale.lastMonth}
      </div>
    </div>
  )
}

ShortcutPanel.displayName = 'ShortcutPanel'

export default ShortcutPanel
