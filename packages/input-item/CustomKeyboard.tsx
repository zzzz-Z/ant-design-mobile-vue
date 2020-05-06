import { IS_IOS } from '../_util/exenv'
import {
  defineComponent,
  h,
  ref,
  cloneVNode,
  Ref,
  PropType,
  VNode,
  inject,
  ComponentInternalInstance,
  mergeProps,
} from 'vue'
import { TouchFeedback } from '../feedback'
import { defineProps } from 'packages/_util/vue-types/defineProps'
import { NumberInputInjectKey } from './CustomInput'
/**
 * determines whether an array includes a certain value among its entries, returning true or false as appropriate.
 * @param {array} arr The array to search in
 * @param {any} item  The value to search for
 */
function includes(arr: Array<any>, item: any) {
  if (!arr || !arr.length || !item) {
    return false
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === item) {
      return true
    }
  }
  return false
}

export type HTMLTableDataProps = Omit<
  React.HTMLProps<HTMLTableDataCellElement>,
  'onClick'
>

export interface KeyboardItemProps extends HTMLTableDataProps {
  prefixCls?: string
  tdRef?: Ref<HTMLTableDataCellElement | null>
  iconOnly?: boolean
  onClick: (
    event: React.TouchEvent<HTMLTableDataCellElement>,
    value: string
  ) => void
}
export const KeyboardItem = defineComponent<KeyboardItemProps>({
  props: defineProps({
    prefixCls: 'am-number-keyboard',
    onClick: () => {},
    disabled: false,
  }),
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    return () => {
      const { disabled, tdRef, label, iconOnly, prefixCls } = props
      const cls = attrs.class
      let value = slots.default?.()?.[0]?.children
      if (cls === 'keyboard-delete') {
        value = 'delete'
      } else if (cls === 'keyboard-hide') {
        value = 'hide'
      } else if (cls === 'keyboard-confirm') {
        value = 'confirm'
      }
      const wrapCls = [
        cls,
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-disabled`]: disabled,
        },
      ]

      const feedProps = {
        disabled: disabled,
        activeClassName: `${prefixCls}-item-active`,
      }
      const tdProps = mergeProps(attrs, {
        ref: tdRef,
        class: wrapCls,
        onClick: (e: Event) => emit('click', e, value),
        onTouchEnd: (e: Event) => emit('click', e, value),
      })

      return h(TouchFeedback, feedProps, () =>
        h('td', tdProps, [
          slots.default?.(),
          iconOnly && h('i', { class: 'sr-only' }, label),
        ])
      )
    }
  },
})

function getAriaAttr(label: string) {
  if (IS_IOS) {
    return { label, iconOnly: true }
  } else {
    return { role: 'button', 'aria-label': label }
  }
}

export interface CustomKeyboardCtx {
  linkedInput?: Ref<any>
  antmKeyboard?: Ref<HTMLDivElement>
  confirmKeyboardItem?: Ref<HTMLTableDataCellElement>
  confirmDisabled?: boolean
}

export const CustomKeyboard = defineComponent({
  props: {
    prefixCls: ({ default: 'am-number-keyboard' } as unknown) as PropType<
      string
    >,
    disabledKeys: { default: null, type: Array },
    backspaceLabel: String,
    header: {} as PropType<VNode>,
    confirmLabel: String,
  } as const,
  inheritAttrs: false,
  setup(props) {
    let antmKeyboard = ref<HTMLDivElement | null>(null)
    let confirmKeyboardItem = ref<HTMLTableDataCellElement | null>(null)
    let confirmDisabled = false
    const linkedInput = inject<ComponentInternalInstance>(NumberInputInjectKey)

    const onKeyboardClick = (e: any, value: string = '') => {
      e.stopImmediatePropagation()
      if (props.disabledKeys && includes(props.disabledKeys, value)) {
        return null
      }
      if (value === 'confirm' && confirmDisabled) {
        return null
      } else {
        ;(linkedInput?.ctx as any)?.onKeyboardClick?.(value)
      }
    }

    const renderKeyboardItem = (item: string, index: number) => {
      let disabled = false
      if (props.disabledKeys && includes(props.disabledKeys, item)) {
        disabled = true
      }
      return h(
        KeyboardItem,
        {
          onClick: onKeyboardClick,
          key: `item-${item}-${index}`,
          disabled,
        },
        () => item
      )
    }

    const renderTable = () => {
      const tr1 = h('tr', [
        ['1', '2', '3'].map((item, index) => renderKeyboardItem(item, index)),
        h(KeyboardItem, {
          class: 'keyboard-delete',
          rowSpan: 2,
          onClick: onKeyboardClick,
          ...getAriaAttr(props.backspaceLabel!),
        }),
      ])
      const tr2 = h('tr', [
        ['4', '5', '6'].map((item, index) => renderKeyboardItem(item, index)),
      ])
      const tr3 = h('tr', [
        ['7', '8', '9'].map((item, index) => renderKeyboardItem(item, index)),
        h(
          KeyboardItem,
          {
            class: 'keyboard-confirm',
            rowSpan: 2,
            onClick: onKeyboardClick,
            tdRef: confirmKeyboardItem,
          },
          () => props.confirmLabel
        ),
      ])
      const tr4 = h('tr', [
        ['.', '0'].map((item, index) => renderKeyboardItem(item, index)),
        h(KeyboardItem, {
          class: 'keyboard-hide',
          onClick: onKeyboardClick,
          ...getAriaAttr(props.backspaceLabel!),
        }),
      ])
      return h('table', h('tbody', [tr1, tr2, tr3, tr4]))
    }

    const isHide = () => (linkedInput?.ctx as any).state.focus

    return () => {
      const { prefixCls, header } = props
      return h(
        'div',
        {
          class: [
            `${prefixCls}-wrapper`,
            {
              [`${prefixCls}-wrapper-hide`]: !isHide(),
            },
          ],
          ref: antmKeyboard,
        },
        [
          header && cloneVNode(header, { onClick: onKeyboardClick }),
          renderTable(),
        ]
      )
    }
  },
})
