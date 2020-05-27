/* tslint:disable:jsx-no-multiline-js */
import treeFilter from 'array-tree-filter'
import { VCCascader, VCPopupCascader } from '../vc-cascader'
import { VCPicker, PickerItem, MultiPicker } from '../vc-picker'
import { useLocale } from '../utils/useLocale'
import { PickerData, PickerPropsType } from './PropsType'
import { VNode, defineComponent, isVNode, cloneVNode, computed } from 'vue'
import popupProps from './popupProps'

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
  name: 'AbstractPicker',
  inheritAttrs: false,
  setup(_, { slots, emit, attrs }) {
    const props = computed(() => {
      return ({
        ...getDefaultProps(),
        ...attrs,
      } as any) as AbstractPickerProps
    })
    let scrollValue: any = null

    const getSel = () => {
      let treeChildren: PickerData[]
      const { data, cascade, value = [], format } = props.value
      if (cascade) {
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
      const node = treeChildren.map((v) => v.label)
      return format?.(node)
    }

    const getPickerCol = () => {
      const { data, pickerPrefixCls, itemStyle, indicatorStyle } = props.value
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
        cascader.onOk = onOk
        cascader.$forceUpdate()
      }
    }

    const onPickerChange = (v: any) => {
      scrollValue = v
      props.value.onPickerChange?.(v)
    }

    const onVisibleChange = (visible: boolean) => {
      scrollValue = undefined
      props.value.onVisibleChange?.(visible)
    }

    const { getLocale } = useLocale('Picker', () => require('./locale/zh_CN'))

    return () => {
      const {
        value = [],
        popupPrefixCls,
        itemStyle,
        indicatorStyle,
        okText,
        dismissText,
        extra,
        cascade,
        prefixCls,
        pickerPrefixCls,
        data,
        cols,
        onOk,
        ...restProps
      } = props.value
      const children = slots.default?.()[0]
      const _locale = getLocale()

      let cascader
      let popupMoreProps = {}
      if (cascade) {
        cascader = (
          <VCCascader
            prefixCls={prefixCls}
            pickerPrefixCls={pickerPrefixCls}
            data={data as PickerData[]}
            cols={cols}
            onChange={onPickerChange}
            onScrollChange={setCasecadeScrollValue}
            pickerItemStyle={itemStyle}
            indicatorStyle={indicatorStyle}
          />
        )
      } else {
        cascader = (
          <MultiPicker
            style={{ flexDirection: 'row', alignItems: 'center' }}
            prefixCls={prefixCls}
            onScrollChange={(v) => (scrollValue = v)}
          >
            {getPickerCol()}
          </MultiPicker>
        )
        popupMoreProps = {
          pickerValueProp: 'selectedValue',
          pickerValueChangeProp: 'onValueChange',
        }
      }
      return (
        <VCPopupCascader
          cascader={cascader}
          {...popupProps}
          // {...restProps}
          prefixCls={popupPrefixCls}
          value={value}
          dismissText={dismissText || _locale.dismissText}
          okText={okText || _locale.okText}
          {...popupMoreProps}
          // onVnodeMounted={fixOnOk}
          onVisibleChange={onVisibleChange}
        >
          {children &&
            typeof children.children !== 'string' &&
            isVNode(children) &&
            cloneVNode(children, { extra: getSel() || extra || _locale.extra })}
        </VCPopupCascader>
      )
    }
  },
})
