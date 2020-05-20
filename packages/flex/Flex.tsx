import { FlexPropsType as BasePropsType } from './PropsType'
import { Events, FunctionalComponent, cloneVNode } from 'vue'

export interface FlexProps extends BasePropsType {
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
  onClick?: (e: Events['onClick']) => void
  role?: string
  prefixCls?: string
}

const Flex: FunctionalComponent<FlexProps> = (props, { slots }) => {
  const {
    direction,
    wrap,
    justify,
    align = 'align',
    prefixCls = 'am-flexbox',
    alignContent,
    ...restProps
  } = props

  const wrapCls = [
    prefixCls,
    {
      [`${prefixCls}-dir-row`]: direction === 'row',
      [`${prefixCls}-dir-row-reverse`]: direction === 'row-reverse',
      [`${prefixCls}-dir-column`]: direction === 'column',
      [`${prefixCls}-dir-column-reverse`]: direction === 'column-reverse',

      [`${prefixCls}-nowrap`]: wrap === 'nowrap',
      [`${prefixCls}-wrap`]: wrap === 'wrap',
      [`${prefixCls}-wrap-reverse`]: wrap === 'wrap-reverse',

      [`${prefixCls}-justify-start`]: justify === 'start',
      [`${prefixCls}-justify-end`]: justify === 'end',
      [`${prefixCls}-justify-center`]: justify === 'center',
      [`${prefixCls}-justify-between`]: justify === 'between',
      [`${prefixCls}-justify-around`]: justify === 'around',

      [`${prefixCls}-align-start`]: align === 'start',
      [`${prefixCls}-align-center`]: align === 'center',
      [`${prefixCls}-align-end`]: align === 'end',
      [`${prefixCls}-align-baseline`]: align === 'baseline',
      [`${prefixCls}-align-stretch`]: align === 'stretch',

      [`${prefixCls}-align-content-start`]: alignContent === 'start',
      [`${prefixCls}-align-content-end`]: alignContent === 'end',
      [`${prefixCls}-align-content-center`]: alignContent === 'center',
      [`${prefixCls}-align-content-between`]: alignContent === 'between',
      [`${prefixCls}-align-content-around`]: alignContent === 'around',
      [`${prefixCls}-align-content-stretch`]: alignContent === 'stretch',
    },
  ]

  return (
    <div class={wrapCls} {...restProps}>
      {slots.default?.()}
    </div>
  )
}

Flex.displayName = 'Flex'
export default Flex as any
