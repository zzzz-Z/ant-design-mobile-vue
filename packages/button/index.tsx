import './style'
import { ButtonProps } from './PropsType'
import { defineComponent, h } from 'vue'
import { TouchFeedback } from '../feedback'

const buttonProps: any = {
  prefixCls: { type: String, default: 'am-button' },
  size: { default: 'arge' },
  type: String,
  inline: Boolean,
  disabled: Boolean,
  loading: Boolean,
  activeStyle: { default: {} },
  activeClassName: String,
}

const Button = defineComponent<ButtonProps>({
  name: 'Button',
  props: buttonProps,
  emits: ['click'],
  setup(props, { slots, emit }) {
    function onClick(e: Event) {
      emit('click', e)
    }
    return () => {
      const { prefixCls, type, size, inline, disabled, icon, loading } = props
      const iconType: any = loading ? 'loading' : icon
      const wrapCls = [
        prefixCls,
        {
          [`${prefixCls}-primary`]: type === 'primary',
          [`${prefixCls}-ghost`]: type === 'ghost',
          [`${prefixCls}-warning`]: type === 'warning',
          [`${prefixCls}-small`]: size === 'small',
          [`${prefixCls}-inline`]: inline,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-loading`]: loading,
          [`${prefixCls}-icon`]: !!iconType,
        },
      ]
      return h(TouchFeedback, props, () =>
        h(
          'a',
          {
            role: 'button',
            class: wrapCls,
            onClick: disabled ? undefined : onClick,
            'aria-disabled': disabled,
          },
          slots.default?.()
        )
      )
    }
  },
})

export default Button
