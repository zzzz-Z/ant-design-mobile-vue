import { defineComponent, h } from 'vue'
import PropTypes from '../_util/vue-types'

export default defineComponent({
  name: 'PanelContent',
  props: {
    prefixCls: PropTypes.string,
    isActive: PropTypes.bool,
    destroyInactivePanel: PropTypes.bool,
    forceRender: PropTypes.bool,
    role: PropTypes.any,
  },
  setup(props, { slots }) {
    return () => {
      const {
        prefixCls,
        isActive,
        destroyInactivePanel,
        forceRender,
        role,
      } = props

      if (forceRender && !isActive) {
        return null
      }

      return h(
        'div',
        {
          role,
          class: {
            [`${prefixCls}-content`]: true,
            [`${prefixCls}-content-active`]: isActive,
          },
        },
        !isActive && destroyInactivePanel
          ? ''
          : h('div', { class: `${prefixCls}-content-box` }, slots.default?.())
      )
    }
  },
})
