import './style'
import { WhiteSpacePropsType } from './PropsType'
import { h, FunctionalComponent } from 'vue'

const WhiteSpace: FunctionalComponent<WhiteSpacePropsType> = (
  _props,
  { slots }
) => {
  const props = {
    prefixCls: 'am-whitespace',
    size: 'md',
    ..._props,
  }
  const { prefixCls, size } = props

  return h(
    'div',
    {
      class: [prefixCls, `${prefixCls}-${size}`],
    },
   slots.default && slots.default()
  )
}

export default WhiteSpace
