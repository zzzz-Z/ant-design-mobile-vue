import './style'
import { ButtonProps } from './PropsType'
import { defineComponent, h } from 'vue'
import { TouchFeedback } from '../feedback'
import { defineProps } from 'packages/_util/vue-types/defineProps'
import Icon from 'packages/icon'

/** BUTTON */
const Button = defineComponent<ButtonProps>({
  name: 'Button',
  props: defineProps({
    prefixCls: 'am-button',
    size: 'large',
    type: String,
    inline: Boolean,
    disabled: Boolean,
    loading: Boolean,
    activeStyle: {},
    activeClassName: String,
  }),
  inheritAttrs: false,
  setup(props, { slots, emit, attrs }) {
    return () => {
      const {
        prefixCls,
        type,
        size,
        inline,
        disabled,
        icon,
        loading,
        activeStyle,
        activeClassName,
        ...restProps
      } = props

      const iconType: any = loading ? 'loading' : icon
      const wrapCls = [
        attrs.class,
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
      return (
        <TouchFeedback
          activeClassName={
            activeClassName || (activeStyle ? `${prefixCls}-active` : undefined)
          }
          disabled={disabled}
          activeStyle={activeStyle}
        >
          <a
            {...restProps}
            {...attrs}
            role="button"
            class={wrapCls}
            onClick={disabled ? undefined : (e) => emit('click', e)}
            aria-disabled={disabled}
          >
            {slots.default?.()}
            {icon && (
              <Icon
                aria-hidden="true"
                type={iconType}
                size={size === 'small' ? 'xxs' : 'md'}
                className={`${prefixCls}-icon`}
              />
            )}
          </a>
        </TouchFeedback>
      )
    }
  },
})

export default Button
