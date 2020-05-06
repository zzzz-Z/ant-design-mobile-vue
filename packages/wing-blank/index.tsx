import './style'
import { WingBlankPropsType } from './PropsType'
import { h, FunctionalComponent } from 'vue'

export interface WingBlankProps extends WingBlankPropsType {
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
}

const WingBlank: FunctionalComponent<WingBlankProps> = (_props, { slots }) => {
  const props = {
    prefixCls: 'am-wingblank',
    size: 'lg',
    ..._props,
  }
  const { prefixCls, size } = props

  return h(
    'div',
    {
      class: [prefixCls, `${prefixCls}-${size}`],
    },
    slots.default?.()
  )
}

export default WingBlank
