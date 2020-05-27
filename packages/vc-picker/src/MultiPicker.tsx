import MultiPickerProps from './MultiPickerProps'
import { cloneVNode, FunctionalComponent } from 'vue'

const MultiPicker: FunctionalComponent<MultiPickerProps> = (
  props,
  { slots }
) => {
  const children = slots.default?.()!

  function getValue() {
    const { selectedValue } = props
    if (selectedValue && selectedValue.length) {
      return selectedValue
    } else {
      if (!children) {
        return []
      }
      return children.map((c) => {
        const cc: any = c.children
        return cc && cc[0] && cc[0].props.value
      })
    }
  }

  function onChange(i: any, v: any, cb: any) {
    const value = getValue().concat()
    value[i] = v
    cb?.(value, i)
  }

  const { prefixCls, rootNativeProps } = props
  const selectedValue = getValue()
  const colElements = children.map((col, i) => {
    return cloneVNode(col, {
      getValue: getValue,
      selectedValue: selectedValue[i],
      onValueChange: (...v: any) => onChange(i, v, props.onValueChange),
      onScrollChange: (...v: any) => onChange(i, v, props.onScrollChange),
    })
  })

  return (
    <div {...rootNativeProps} class={prefixCls}>
      {colElements}
    </div>
  )
}

export default MultiPicker
