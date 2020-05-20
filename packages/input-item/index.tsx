import { useLocale } from '../utils/useLocale'
import CustomInput from './CustomInput'
import { InputItemPropsType } from './PropsType'
import {
  defineComponent,
  ref,
  reactive,
  watch,
  h,
  InputHTMLAttributes,
  Events,
  getCurrentInstance,
  computed,
} from 'vue'
import { defineProps } from '../_util/vue-types/defineProps'
import { TouchFeedback } from '../feedback'
import { withVif } from '../utils/directives'

export type HTMLInputProps = Omit<
  InputHTMLAttributes,
  'onChange' | 'onFocus' | 'onBlur' | 'value' | 'defaultValue' | 'type' | 'size'
>
export interface InputItemProps extends InputItemPropsType, HTMLInputProps {
  prefixCls?: string
  prefixListCls?: string
  autoAdjustHeight?: boolean
  onErrorClick?: Events['onClick']
  onExtraClick?: Events['onClick']
  modelValue?: string
}

function normalizeValue(value?: string) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value + ''
}

const InputItem = defineComponent<InputItemProps>({
  props: defineProps({
    maxLength: Number,
    value: [String, Number],
    modelValue: [String, Number],
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
  }),
  emits: ['change', 'blur', 'focus', 'input'],
  setup(props, { slots, emit, attrs }) {
    const inputRef = ref<any>(null)
    const ctx = (getCurrentInstance() as any).ctx
    ctx.focus = () => inputRef?.value?.focus?.()

    const state = reactive({
      focus: false,
      placeholder: props.placeholder,
      value: normalizeValue(props.modelValue || props.value),
      inputType: computed(() => {
        const type = props.type
        return type === 'bankCard' || type === 'phone'
          ? 'tel'
          : type === 'password'
          ? 'password'
          : type === 'digit'
          ? 'number'
          : 'text'
      }),
    })

    watch(
      [() => props.value, () => props.modelValue],
      ([value, modelValue]) => {
        state.value = modelValue! || value!
      }
    )
    watch(
      () => state.value,
      (value) => {
        emit('change', value)
      }
    )

    const onInputChange = (e: any) => {
      const el = e.target!
      const { value: rawVal } = el
      let ctrlValue = rawVal
      switch (props.type) {
        case 'bankCard':
          ctrlValue = rawVal.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
          break
        case 'phone':
          ctrlValue = rawVal.replace(/\D/g, '').substring(0, 11)
          const valueLen = ctrlValue.length
          if (valueLen > 3 && valueLen < 8) {
            ctrlValue = `${ctrlValue.substr(0, 3)} ${ctrlValue.substr(3)}`
          } else if (valueLen >= 8) {
            const mid = `${ctrlValue.substr(3, 4)}`
            const end = `${ctrlValue.substr(7)}`
            ctrlValue = `${ctrlValue.substr(0, 3)} ${mid} ${end}`
          }
          break
        case 'number':
          ctrlValue = rawVal.replace(/\D/g, '')
          break
      }

      ctrlValue !== rawVal && (el.value = ctrlValue)
      state.value = ctrlValue
    }

    const onInputFocus = () => {
      state.focus = true
      emit('focus')
    }

    const onInputBlur = () => {
      state.focus = false
      emit('blur')
    }

    const clearInput = () => {
      if (props.type !== 'password' && props.updatePlaceholder) {
        state.placeholder = props.value
      }
      state.value = ''
      ctx.focus()
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
        clear,
        error,
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
      const { disabled, maxLength } = restProps
      const { value, focus, placeholder } = state
      const { confirmLabel, backspaceLabel, cancelKeyboardLabel } = getLocale()
      const wrapCls = [
        `${prefixListCls}-item`,
        `${prefixCls}-item`,
        `${prefixListCls}-item-middle`,
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
            { class: `${prefixCls}-control` },
            type === 'money'
              ? h(CustomInput, {
                  ...attrs,
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
                  confirmLabel,
                  backspaceLabel,
                  cancelKeyboardLabel,
                  moneyKeyboardAlign,
                  moneyKeyboardWrapProps,
                  moneyKeyboardHeader,
                  autoAdjustHeight,
                  disabledKeys,
                })
              : h('input', {
                  ...attrs,
                  ...patternProps,
                  ...restProps,
                  ...classNameProps,
                  value: state.value,
                  ref: inputRef,
                  type: state.inputType,
                  placeholder,
                  onInput: onInputChange,
                  onFocus: onInputFocus,
                  onBlur: onInputBlur,
                  readOnly: !editable,
                  disabled,
                })
          ),
          withVif(
            h(
              TouchFeedback,
              { activeClassName: `${prefixCls}-clear-active` },
              () =>
                h('div', {
                  class: `${prefixCls}-clear`,
                  onClick: clearInput,
                })
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
