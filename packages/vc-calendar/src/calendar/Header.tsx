import { FunctionalComponent, VNode } from 'vue'
import { Locale } from '../date/DataTypes'

export interface HeaderPropsType {
  title?: string
  locale?: Locale
  showClear?: boolean
  onCancel?: () => void
  onClear?: () => void
  closeIcon?: JSX.Element
  clearIcon?: JSX.Element
}

const Header: FunctionalComponent<HeaderPropsType> = (props, { emit }) => {
  const {
    title,
    locale = {} as Locale,
    showClear,
    closeIcon = 'X',
    clearIcon,
  } = props

  return (
    <div class="header">
      <span class="left" onClick={() => emit('cancel')}>
        {closeIcon}
      </span>
      <span class="title">{title || locale.title}</span>
      {showClear && (
        <span class="right" onClick={() => emit('clear')}>
          {clearIcon || locale.clear}
        </span>
      )}
    </div>
  )
}
export default Header
