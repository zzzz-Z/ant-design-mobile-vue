import { ref, defineComponent, h } from 'vue'
import bindCtx from '../utils/bindCtx'
import { InputEventHandler } from './PropsType'

export type HTMLInputProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  'onFocus' | 'onBlur'
>
export interface InputProps extends HTMLInputProps {
  onFocus?: InputEventHandler
  onBlur?: InputEventHandler
}
export default defineComponent<InputProps>({
  name: 'Input',
  setup(props, { emit, attrs }) {
    const inputRef = ref<HTMLElement | null>(null)

    bindCtx({ focus: () => inputRef?.value?.focus() })

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = (e.target as any).value
      emit('blur', value)
    }
    const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // here should have a value definition but none.
      const value = (e.target as any).value
      emit('focus', value)
    }
    return () =>
      h('input', {
        ref: inputRef,
        onBlur: onInputBlur,
        onFocus: onInputFocus,
        ...attrs,
      })
  },
})
