import loadSprite from './loadSprite'
import { IconPropsType } from './PropsType'
import { defineComponent, h, onMounted } from 'vue'

export interface IconProps extends IconPropsType {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
  onClick?: (evt: Event) => void
}

const Icon = defineComponent<IconProps>({
  props: {
    size: { type: String, default: 'md' },
    type: String,
    color: String,
  } as any,
  setup(props) {
    onMounted(loadSprite)
    return () => {
      const { type, size } = props
      return h(
        'svg',
        {
          class: ['am-icon', `am-icon-${type}`, `am-icon-${size}`],
        },
        h('use', { 'xlink:href': `#${type}` })
      )
    }
  },
})

export default Icon
