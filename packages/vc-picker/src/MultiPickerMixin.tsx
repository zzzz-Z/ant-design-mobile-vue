import MultiPickerProps from './MultiPickerProps'
import { SetupContext } from 'vue'

export default function (ComposedComponent: any) {
  return (props: MultiPickerProps, { slots }: SetupContext) => {
    function getValue() {
      const children = slots.default?.()
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

    const onValueChange = (i: any, v: any) => {
      onChange(i, v, props.onValueChange)
    }

    const onScrollChange = (i: any, v: any) => {
      onChange(i, v, props.onScrollChange)
    }
    return (
      <ComposedComponent
        {...props}
        getValue={getValue}
        onValueChange={onValueChange}
        onScrollChange={props.onScrollChange && onScrollChange}
      >
        {slots.default?.()}
      </ComposedComponent>
    )
  }
}
