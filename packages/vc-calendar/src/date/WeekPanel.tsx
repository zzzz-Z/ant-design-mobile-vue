import { FunctionalComponent } from 'vue'
import { Locale } from './DataTypes'

export interface PropsType {
  locale: Locale
}
const WeekPanel: FunctionalComponent<PropsType> = (props) => {
  const { locale } = props
  const { week } = locale
  return (
    <div class="week-panel">
      <div class="cell cell-grey">{week[0]}</div>
      <div class="cell">{week[1]}</div>
      <div class="cell">{week[2]}</div>
      <div class="cell">{week[3]}</div>
      <div class="cell">{week[4]}</div>
      <div class="cell">{week[5]}</div>
      <div class="cell cell-grey">{week[6]}</div>
    </div>
  )
}
export default WeekPanel
