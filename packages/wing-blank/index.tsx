import './style'
import { WingBlankPropsType } from './PropsType'
import { h, FunctionalComponent, CSSProperties } from 'vue'

export interface WingBlankProps extends WingBlankPropsType {
  prefixCls?: string
  className?: string
  style?: CSSProperties | string
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
