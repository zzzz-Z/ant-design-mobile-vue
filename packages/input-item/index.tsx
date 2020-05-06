import './style'
import { useLocale } from '../utils/useLocale'
import CustomInput from './CustomInput'
import Input from './Input'
import { InputItemPropsType } from './PropsType'
import { defineComponent, ref, reactive, watch, onUnmounted, h } from 'vue'
import { defineProps } from '../_util/vue-types/defineProps'
import { TouchFeedback } from '../feedback'
import { withVif } from '../utils/directives'

export type HTMLInputProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  'onChange' | 'onFocus' | 'onBlur' | 'value' | 'defaultValue' | 'type'
>
export interface InputItemProps extends InputItemPropsType, HTMLInputProps {
  prefixCls?: string
  prefixListCls?: string
  className?: string
  autoAdjustHeight?: boolean
  onErrorClick?: React.MouseEventHandler<HTMLDivElement>
  onExtraClick?: React.MouseEventHandler<HTMLDivElement>
}

function noop() {}

function normalizeValue(value?: string) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value + ''
}

const InputItem = defineComponent<InputItemProps>({
  props: defineProps({
    maxLength: undefined,
    value: '',
    prefixCls: 'am-input',
    prefixListCls: 'am-list',
    type: 'text',
    editable: true,
    disabled: false,
    placeholder: '',
    clear: false,
    extra: '',
    error: false,
    labelNumber: 5,
    updatePlaceholder: false,
    moneyKeyboardAlign: 'right',
    moneyKeyboardWrapProps: {},
    moneyKeyboardHeader: undefined,
    disabledKeys: undefined,
  }) as any,
  emits: ['change', 'blur', 'focus', 'input'],
  setup(props, { slots, emit }) {
    const inputRef = ref<any>(null)
    let debounceTimeout: number | null
    const state = reactive({
      focus: false,
      placeholder: props.placeholder,
      value: normalizeValue(props.value || props.defaultValue),
    })

    watch(
      () => props.value,
      (val) => {
        state.value = val!
      }
    )
    watch(
      () => state.value,
      (val) => {
        emit('change', val)
        emit('input', val)
      }
    )

    onUnmounted(() => {
      if (debounceTimeout) {
        window.clearTimeout(debounceTimeout)
        debounceTimeout = null
      }
    })

    const handleOnChange = (
      value: string,
      isMutated = false,
      adjustPos = noop
    ) => {
      state.value = value
      isMutated ? setTimeout(adjustPos) : adjustPos()
    }
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const el = e.target
      const { value: rawVal } = el

      let prePos = 0
      try {
        // some input type do not support selection, see https://html.spec.whatwg.org/multipage/input.html#do-not-apply
        prePos = el.selectionEnd || 0
      } catch (error) {
        console.warn('Get selection error:', error)
      }

      const { value: preCtrlVal = '' } = state
      const { type } = props

      let ctrlValue = rawVal
      switch (type) {
        case 'bankCard':
          ctrlValue = rawVal.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
          break
        case 'phone':
          ctrlValue = rawVal.replace(/\D/g, '').substring(0, 11)
          const valueLen = ctrlValue.length
          if (valueLen > 3 && valueLen < 8) {
            ctrlValue = `${ctrlValue.substr(0, 3)} ${ctrlValue.substr(3)}`
          } else if (valueLen >= 8) {
            ctrlValue = `${ctrlValue.substr(0, 3)} ${ctrlValue.substr(
              3,
              4
            )} ${ctrlValue.substr(7)}`
          }
          break
        case 'number':
          ctrlValue = rawVal.replace(/\D/g, '')
          break
        case 'text':
        case 'password':
        default:
          break
      }
      handleOnChange(ctrlValue, ctrlValue !== rawVal, () => {
        switch (type) {
          case 'bankCard':
          case 'phone':
          case 'number':
            // controlled input type needs to adjust the position of the caret
            try {
              // some input type do not support selection, see https://html.spec.whatwg.org/multipage/input.html#do-not-apply
              let pos = calcPos(
                prePos,
                preCtrlVal,
                rawVal,
                ctrlValue,
                [' '],
                /\D/g
              )
              if (
                (type === 'phone' && (pos === 4 || pos === 9)) ||
                (type === 'bankCard' && pos > 0 && pos % 5 === 0)
              ) {
                pos -= 1
              }
              el.selectionStart = el.selectionEnd = pos
            } catch (error) {
              console.warn('Set selection error:', error)
            }
            break
          default:
            break
        }
      })
    }

    const onInputFocus = (value: string) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
        debounceTimeout = null
      }
      state.focus = true
      emit('focus', value)
    }
    const onInputBlur = (value: string) => {
      if (inputRef) {
        // inputRef may be null if customKeyboard unmount
        debounceTimeout = window.setTimeout(() => {
          if (document.activeElement !== (inputRef && inputRef.inputRef)) {
            state.focus = false
          }
        }, 200)
      }
      if (props.onBlur) {
        // fix autoFocus item blur with flash
        setTimeout(() => {
          // fix ios12 wechat browser click failure after input
          if (document.body) {
            document.body.scrollTop = document.body.scrollTop
          }
        }, 100)
        props.onBlur(value)
      }
    }
    const clearInput = () => {
      if (props.type !== 'password' && props.updatePlaceholder) {
        state.placeholder = props.value
      }
      state.value = ''
      focus()
    }

    // this is instance method for user to use
    const focus = () => {
      inputRef?.value?.inputRef?.value?.focus()
    }

    // calculate the position of the caret
    const calcPos = (
      prePos: number,
      preCtrlVal: string,
      rawVal: string,
      ctrlVal: string,
      placeholderChars: Array<string>,
      maskReg: RegExp
    ) => {
      const editLength = rawVal.length - preCtrlVal.length
      const isAddition = editLength > 0
      let pos = prePos
      if (isAddition) {
        const additionStr = rawVal.substr(pos - editLength, editLength)
        let ctrlCharCount = additionStr.replace(maskReg, '').length
        pos -= editLength - ctrlCharCount
        let placeholderCharCount = 0
        while (ctrlCharCount > 0) {
          if (
            placeholderChars.indexOf(
              ctrlVal.charAt(pos - ctrlCharCount + placeholderCharCount)
            ) === -1
          ) {
            ctrlCharCount--
          } else {
            placeholderCharCount++
          }
        }
        pos += placeholderCharCount
      }
      return pos
    }

    const { getLocale } = useLocale('InputItem', () =>
      require('./locale/zh_CN')
    )

    return () => {
      const {
        updatePlaceholder,
        prefixCls,
        prefixListCls,
        editable,
        style,
        clear,
        error,
        className,
        extra,
        labelNumber,
        type,
        onExtraClick,
        onErrorClick,
        moneyKeyboardAlign,
        moneyKeyboardWrapProps,
        moneyKeyboardHeader,
        onVirtualKeyboardConfirm,
        autoAdjustHeight,
        disabledKeys,
        ...restProps
      } = props
      const { name, disabled, maxLength } = restProps
      const { value, focus, placeholder } = state
      const { confirmLabel, backspaceLabel, cancelKeyboardLabel } = getLocale()
      const wrapCls = [
        `${prefixListCls}-item`,
        `${prefixCls}-item`,
        `${prefixListCls}-item-middle`,
        className,
        {
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-error`]: error,
          [`${prefixCls}-focus`]: focus,
          [`${prefixCls}-android`]: focus,
        },
      ]

      const labelCls = [
        `${prefixCls}-label`,
        {
          [`${prefixCls}-label-2`]: labelNumber === 2,
          [`${prefixCls}-label-3`]: labelNumber === 3,
          [`${prefixCls}-label-4`]: labelNumber === 4,
          [`${prefixCls}-label-5`]: labelNumber === 5,
          [`${prefixCls}-label-6`]: labelNumber === 6,
          [`${prefixCls}-label-7`]: labelNumber === 7,
        },
      ]

      const controlCls = `${prefixCls}-control`
      let inputType: any = 'text'
      if (type === 'bankCard' || type === 'phone') {
        inputType = 'tel'
      } else if (type === 'password') {
        inputType = 'password'
      } else if (type === 'digit') {
        inputType = 'number'
      } else if (type !== 'text' && type !== 'number') {
        inputType = type
      }

      let patternProps
      if (type === 'number') {
        patternProps = {
          pattern: '[0-9]*',
        }
      }

      let classNameProps
      if (type === 'digit') {
        classNameProps = {
          className: 'h5numInput', // the name is bad! todos rename.
        }
      }

      return h('div', { class: wrapCls }, [
        h('div', { class: `${prefixListCls}-line` }, [
          slots.default ? h('div', { class: labelCls }, slots.default()) : null,
          h(
            'div',
            { class: controlCls },
            type === 'money'
              ? h(CustomInput, {
                  value: normalizeValue(value),
                  ref: inputRef,
                  type,
                  maxLength,
                  placeholder,
                  onChange: onInputChange,
                  onFocus: onInputFocus,
                  onBlur: onInputBlur,
                  onVirtualKeyboardConfirm,
                  disabled,
                  prefixCls,
                  editable,
                  style,
                  confirmLabel,
                  backspaceLabel,
                  cancelKeyboardLabel,
                  moneyKeyboardAlign,
                  moneyKeyboardWrapProps,
                  moneyKeyboardHeader,
                  autoAdjustHeight,
                  disabledKeys,
                })
              : h(Input, {
                  ...patternProps,
                  ...restProps,
                  ...classNameProps,
                  value: normalizeValue(value),
                  ref: inputRef,
                  style: style,
                  type: inputType,
                  name,
                  placeholder,
                  onChange: onInputChange,
                  onFocus: onInputFocus,
                  onBlur: onInputBlur,
                  readOnly: !editable,
                  disabled: disabled,
                })
          ),
          withVif(
            h(
              TouchFeedback,
              { activeClassName: `${prefixCls}-clear-active` },
              () =>
                h('div', { class: `${prefixCls}-clear`, onClick: clearInput })
            ),
            clear && editable && !disabled && value && `${value}`.length > 0
          ),
          withVif(
            h(
              'div',
              { class: `${prefixCls}-extra}`, onClick: onExtraClick },
              extra
            ),
            (extra as any) !== ''
          ),
        ]),
      ])
    }
  },
})

export default InputItem
