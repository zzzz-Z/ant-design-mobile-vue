import { BadgePropsTypes } from './PropsType'
import { defineComponent, h, CSSProperties } from 'vue'
import { defineProps } from '../_util/vue-types/defineProps'
export interface BadgeProps extends BadgePropsTypes {
  prefixCls?: String
  className?: string
  hot?: boolean
  style?: CSSProperties | string
}

const Badge = defineComponent<BadgeProps>({
  name: 'Badge',
  props: {
    hot: Boolean,
    text: undefined,
    ...defineProps({
      prefixCls: 'am-badge',
      size: 'small',
      overflowCount: 99,
      dot: false,
      corner: false,
    }),
  } as any,
  setup(props, { slots }) {
    return () => {
      let { prefixCls, text, size, overflowCount, dot, corner, hot } = props
      const children = slots.default
      overflowCount = overflowCount as number
      text =
        typeof text === 'number' && text > overflowCount
          ? `${overflowCount}+`
          : text

      // dot mode don't need text
      if (dot) {
        text = ''
      }

      const scrollNumberCls = {
        [`${prefixCls}-dot`]: dot,
        [`${prefixCls}-dot-large`]: dot && size === 'large',
        [`${prefixCls}-text`]: !dot && !corner,
        [`${prefixCls}-corner`]: corner,
        [`${prefixCls}-corner-large`]: corner && size === 'large',
      }

      const badgeCls = [
        prefixCls,
        {
          [`${prefixCls}-not-a-wrapper`]: !children,
          [`${prefixCls}-corner-wrapper`]: corner,
          [`${prefixCls}-hot`]: !!hot,
          [`${prefixCls}-corner-wrapper-large`]: corner && size === 'large',
        },
      ]

      return h('span', { class: badgeCls }, [
        children?.(),
        (text || dot) && h('sup', { class: scrollNumberCls }, text),
      ])
    }
  },
})

export default Badge
