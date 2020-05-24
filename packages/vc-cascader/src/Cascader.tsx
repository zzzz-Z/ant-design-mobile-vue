import arrayTreeFilter from 'array-tree-filter'
import { VCPicker, MultiPicker, PickerItem } from 'packages/vc-picker'
import { ICascaderProps, cascaderProps } from './CascaderTypes'
import { defineComponent, reactive, watch } from 'vue'

export default defineComponent<ICascaderProps>({
  name: 'Cascader',
  props: cascaderProps,
  emits: ['change'],
  setup(props, { emit }) {
    const state = reactive({
      value: getValue(props.data, props.defaultValue || props.value),
    })

    watch(
      () => props.value,
      (val) => {
        state.value = getValue(props.data, val)
      }
    )
    function getValue(d: any, val: any) {
      let data = d || props.data
      let value = val || props.value || props.defaultValue
      if (!value || !value.length || value.indexOf(undefined) > -1) {
        value = []
        for (let i = 0; i < props.cols!; i++) {
          if (data && data.length) {
            value[i] = data[0].value
            data = data[0].children
          }
        }
      }
      return value
    }

    function onValueChange(value: any, index: number) {
      const children = arrayTreeFilter(props.data, (c, level) => {
        return level <= index && c.value === value[level]
      })
      let data = children[index]
      let i
      for (
        i = index + 1;
        data && data.children && data.children.length && i < props.cols!;
        i++
      ) {
        data = data.children[0]
        value[i] = data.value
      }
      value.length = i
      state.value = value
      emit('change', value)
    }

    function getCols() {
      const {
        data,
        cols,
        pickerPrefixCls,
        disabled,
        pickerItemStyle,
        indicatorStyle,
      } = props
      const value = state.value
      const childrenTree = arrayTreeFilter(
        data,
        (c, level) => c.value === value[level]
      ).map((c) => c.children)

      // in case the users data is async get when select change
      const needPad = cols! - childrenTree.length
      if (needPad > 0) {
        for (let i = 0; i < needPad; i++) {
          childrenTree.push([])
        }
      }
      childrenTree.length = cols! - 1
      childrenTree.unshift(data)
      return childrenTree.map((children: any[] = [], level) => (
        <VCPicker
          key={level}
          prefixCls={pickerPrefixCls}
          style={{ flex: 1 }}
          disabled={disabled}
          itemStyle={pickerItemStyle}
          indicatorStyle={indicatorStyle}
        >
          {children.map((item) => (
            <PickerItem
              children={item.label}
              value={item.value}
              key={item.value}
            />
          ))}
        </VCPicker>
      ))
    }

    return () => {
      const { prefixCls, className, rootNativeProps, style } = props
      const cols = getCols()
      const multiStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }
      return (
        <MultiPicker
          style={multiStyle}
          prefixCls={prefixCls}
          className={className}
          selectedValue={state.value}
          rootNativeProps={rootNativeProps}
          onValueChange={onValueChange}
          onScrollChange={props.onScrollChange}
        >
          {cols}
        </MultiPicker>
      )
    }
  },
})
