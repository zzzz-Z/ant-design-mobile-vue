import {
  defineComponent,
  ref,
  reactive,
  watch,
  onUnmounted,
  h,
  Teleport,
  getCurrentInstance,
  provide,
} from 'vue'
import { CustomKeyboard } from './CustomKeyboard'
import { InputEventHandler, InputKey } from './PropsType'
import { canUseDOM } from '../_util/exenv'
import { VNode } from 'vue'
import { withVif, withClickoutside } from '../utils/directives'
import bindCtx from 'packages/utils/bindCtx'
import { noop } from 'packages/_util/vue-types/utils'

export const NumberInputInjectKey = Symbol()

export interface NumberInputProps {
  placeholder?: string
  disabled?: boolean
  editable?: boolean
  moneyKeyboardAlign?: 'left' | 'right' | string
  moneyKeyboardWrapProps?: object
  moneyKeyboardHeader?: VNode
  value?: string
  prefixCls?: string
  keyboardPrefixCls?: string
  onChange?: (e: any) => void
  onFocus?: InputEventHandler
  onBlur?: InputEventHandler
  onVirtualKeyboardConfirm?: InputEventHandler
  confirmLabel: any
  backspaceLabel: any
  cancelKeyboardLabel: any
  maxLength?: number
  type?: string
  style?: any
  autoAdjustHeight?: boolean
  disabledKeys?: Array<InputKey> | null
}

export default defineComponent<NumberInputProps>({
  props: {
    prefixCls: { default: 'am-input', type: String },
    keyboardPrefixCls: { default: 'am-number-keyboard' },
    placeholder: { default: '', type: String },
    disabled: { default: false, type: Boolean },
    editable: { default: true, type: Boolean },
    moneyKeyboardAlign: String,
    moneyKeyboardWrapProps: Object,
    moneyKeyboardHeader: {},
    value: String,
    confirmLabel: String,
    backspaceLabel: String,
    cancelKeyboardLabel: String,
    maxLength: Number,
    type: String,
    autoAdjustHeight: Boolean,
    disabledKeys: Array,
  } as any,
  emits: ['change', 'focus', 'blur', 'virtualKeyboardConfirm'],
  setup(props, { emit }) {
    let container: HTMLDivElement
    let keyBoard: VNode | null
    const inputRef = ref<HTMLDivElement | null>(null)
    const instance = getCurrentInstance()
    const state = reactive({
      focus: false,
      value: props.value || '',
    })
    provide(NumberInputInjectKey, instance)
    bindCtx({ state, inputRef, onKeyboardClick })
    watch(
      () => props.value,
      (val) => {
        state.value = val!
      }
    )

    onUnmounted(() => {
      state.focus && emit('blur', state.value)
      removeBlurListener()
    })

    const onChange = (value: any) => {
      if (!('value' in props)) {
        state.value = value.target.value
      }
      emit('change', value)
    }

    const onConfirm = (value: any) => {
      emit('virtualKeyboardConfirm', value)
    }

    const addBlurListener = () => {
      document.addEventListener('touchend', doBlur, false)
    }

    const removeBlurListener = () => {
      document.removeEventListener('touchend', doBlur, false)
    }

    const onInputBlur = (value: string) => {
      // keyBoard = null
      const { focus } = state
      if (focus) {
        state.focus = false
        emit('blur', value)
        setTimeout(() => {
          removeBlurListener()
        }, 50)
      }
    }

    const getContainer = () => {
      const { keyboardPrefixCls } = props
      let el = document.querySelector(
        `#${keyboardPrefixCls}-container`
      ) as HTMLDivElement
      if (!el) {
        el = document.createElement('div')
        el.setAttribute('id', `${keyboardPrefixCls}-container`)
        document.body.appendChild(el)
      }
      container = el
      return container
    }

    const renderCustomKeyboard = () => {
      const {
        confirmLabel,
        backspaceLabel,
        cancelKeyboardLabel,
        keyboardPrefixCls,
        moneyKeyboardWrapProps,
        moneyKeyboardHeader,
        disabledKeys,
      } = props

      keyBoard = h(
        Teleport,
        { to: getContainer() },
        h(CustomKeyboard, {
          onClick: onKeyboardClick,
          prefixCls: keyboardPrefixCls!,
          confirmLabel,
          backspaceLabel,
          cancelKeyboardLabel,
          wrapProps: moneyKeyboardWrapProps,
          header: moneyKeyboardHeader,
          disabledKeys: disabledKeys!,
        })
      )
    }

    const handlefocus = () => {
      // this focus may invocked by users page button click, so this click may trigger blurEventListener at the same time
      renderCustomKeyboard()
      removeBlurListener()
      !state.focus && onInputFocus()
      setTimeout(addBlurListener, 50)
    }

    const onInputFocus = () => {
      const value = state.value
      state.focus = true
      emit('focus', value)
    }

    function onKeyboardClick(KeyboardItemValue: string) {
      const { maxLength } = props
      const { value } = state

      let valueAfterChange
      // 删除键
      if (KeyboardItemValue === 'delete') {
        valueAfterChange = value.substring(0, value.length - 1)
        onChange({ target: { value: valueAfterChange } })
        // 确认键
      } else if (KeyboardItemValue === 'confirm') {
        valueAfterChange = value
        onChange({ target: { value: valueAfterChange } })

        onInputBlur(value)
        onConfirm(value)
        // 收起键
      } else if (KeyboardItemValue === 'hide') {
        valueAfterChange = value
        onInputBlur(valueAfterChange)
      } else {
        if (
          maxLength !== undefined &&
          +maxLength >= 0 &&
          (value + KeyboardItemValue).length > maxLength
        ) {
          valueAfterChange = (value + KeyboardItemValue).substr(0, maxLength)
          onChange({ target: { value: valueAfterChange } })
        } else {
          valueAfterChange = value + KeyboardItemValue
          onChange({ target: { value: valueAfterChange } })
        }
      }
    }

    const renderPortal = () => {
      if (!canUseDOM) {
        return null
      }
      return keyBoard
    }

    const doBlur = (ev: Event) => {
      const { value } = state
      if (ev.target !== inputRef.value) {
        onInputBlur(value)
      }
    }

    return () => {
      const { placeholder, disabled, editable, moneyKeyboardAlign } = props
      const { focus, value } = state
      const preventKeyboard = disabled || !editable
      const fakeInputCls = [
        `fake-input`,
        {
          focus,
          'fake-input-disabled': disabled,
        },
      ]
      const fakeInputContainerCls = [
        'fake-input-container',
        {
          'fake-input-container-left': moneyKeyboardAlign === 'left',
        },
      ]

      return withClickoutside(
        h('div', { class: fakeInputContainerCls }, [
          withVif(
            h('div', { class: 'fake-input-placeholder' }, placeholder),
            value === ''
          ),
          h(
            'div',
            {
              role: 'textbox',
              'aria-label': value || placeholder,
              class: fakeInputCls,
              ref: inputRef,
              onClick: preventKeyboard ? noop : handlefocus,
            },
            value
          ),
          renderPortal(),
        ]),
        doBlur
      )
    }
  },
})
