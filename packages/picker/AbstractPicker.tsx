/* tslint:disable:jsx-no-multiline-js */
import treeFilter from 'array-tree-filter'
import { VCCascader, VCPopupCascader } from '../vc-cascader'
import { VCPicker, PickerItem } from '../vc-picker'
import useLocale from '../utils/useLocale'
import { PickerData, PickerPropsType } from './PropsType'
import { VNode, FunctionalComponent, defineComponent } from 'vue'

export interface AbstractPickerProps extends PickerPropsType {
  pickerPrefixCls?: string
  popupPrefixCls?: string
}

export function getDefaultProps() {
  const defaultFormat = (values: VNode[]) => {
    // label is JSX.Element or other
    if (values.length > 0 && typeof values[0].children !== 'string') {
      return values
    }
    return values.join(',')
  }
  return {
    triggerType: 'onClick',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    popupPrefixCls: 'am-picker-popup',
    format: defaultFormat,
    cols: 3,
    cascade: true,
    title: '',
  }
}

export default defineComponent<AbstractPickerProps>({
  setup(props, { slots, emit }) {
    let scrollValue: any = null
    const popupProps = {}
    const getSel = () => {
      const value = props.value || []
      let treeChildren: PickerData[]
      const { data } = props
      if (props.cascade) {
        treeChildren = treeFilter(
          data as PickerData[],
          (c: any, level: any) => {
            return c.value === value[level]
          }
        )
      } else {
        treeChildren = value.map((v, i) => {
          return (data as PickerData[][])[i].filter((d) => d.value === v)[0]
        })
      }
      return (
        props.format &&
        props.format(
          treeChildren.map((v) => {
            return v.label
          })
        )
      )
    }
    const getPickerCol = () => {
      const { data, pickerPrefixCls, itemStyle, indicatorStyle } = props
      return (data as PickerData[][]).map((col, index) => {
        return (
          <VCPicker
            key={index}
            prefixCls={pickerPrefixCls}
            style={{ flex: 1 }}
            itemStyle={itemStyle}
            indicatorStyle={indicatorStyle}
          >
            {col.map((item) => {
              return (
                <PickerItem
                  children={item.label}
                  key={item.value}
                  value={item.value}
                />
              )
            })}
          </VCPicker>
        )
      })
    }
    const onOk = (v: any) => {
      if (scrollValue !== undefined) {
        v = scrollValue
      }
      emit('change', v)
      emit('ok', v)
    }
    const setCasecadeScrollValue = (v: any) => {
      // 级联情况下保证数据正确性，滚动过程中只有当最后一级变化时才变更数据
      if (v && scrollValue) {
        const length = scrollValue.length
        if (length === v.length && scrollValue[length - 1] === v[length - 1]) {
          return
        }
      }
      scrollValue = v
    }
    const fixOnOk = (cascader: any) => {
      if (cascader && cascader.onOk !== onOk) {
        // cascader.onOk = onOk
        // cascader.forceUpdate()
      }
    }

    const onPickerChange = (v: any) => {
      scrollValue = v
      if (this.props.onPickerChange) {
        this.props.onPickerChange(v)
      }
    }
  },
})
