import MultiPickerProps from './MultiPickerProps'
import MultiPickerMixin from './MultiPickerMixin'
import { cloneVNode, FunctionalComponent } from 'vue'

export interface IMultiPickerProp {
  getValue: () => any
}

const MultiPicker: FunctionalComponent<IMultiPickerProp & MultiPickerProps> = (
  props,
  { slots, emit }
) => {
  const { prefixCls, rootNativeProps } = props
  const selectedValue = props.getValue()
  const colElements = slots.default?.().map((col, i) => {
    return cloneVNode(col, {
      selectedValue: selectedValue[i],
      onValueChange: (...args: any) => emit('valueChange', i, ...args),
      onScrollChange: (...args: any) => emit('scrollChange', i, ...args),
    })
  })
  return (
    <div {...rootNativeProps} class={prefixCls}>
      {colElements}
    </div>
  )
}

export default MultiPickerMixin(MultiPicker)
