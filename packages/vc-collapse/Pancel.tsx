import {
  defineComponent,
  h,
  Transition,
  inject,
  computed,
  getCurrentInstance,
} from 'vue'
import {
  panelProps,
  CollapseInstance,
  VcCollapseProps,
  CollapseInjectionKey,
} from './interface'
import { initDefaultProps } from '../_util/initDefaultProps'
import PanelContent from './PanelContent'
import { withVshow } from '../utils/directives'

export default defineComponent({
  name: 'Panel',
  props: initDefaultProps(panelProps(), {
    showArrow: true,
    isActive: false,
    destroyInactivePanel: false,
    headerClass: '',
    forceRender: false,
  }),
  setup(props, { slots, emit }) {
    const uid = getCurrentInstance()!.uid
    const collapse = inject<CollapseInstance>(CollapseInjectionKey)!
    const cPorps = (collapse.props as unknown) as VcCollapseProps
    const cState = collapse.ctx._state
    const prefixCls = cPorps.prefixCls
    const key = computed(() => props.panelKey || uid)

    const isActive = computed(() => {
      const activeKey = cState.activeKey
      return cPorps.accordion
        ? activeKey === key.value
        : activeKey.includes(key.value)
    })

    function handleItemClick() {
      cState.onClickItem(key.value)
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        handleItemClick()
      }
    }

    function renderHeader() {
      return h(
        'div',
        {
          class: [`${prefixCls}-header`, props.headerClass],
          onClick: handleItemClick,
          onKeypress: handleKeyPress,
          role: cPorps.accordion ? 'tab' : 'button',
          tabIndex: props.disabled ? -1 : 0,
          'aria-expanded': isActive.value,
        },
        [
          props.showArrow
            ? cPorps.expandIcon?.(props) || h('i', { class: 'arrow' })
            : null,
          props.header || slots.header?.(),
          props.extra && h('div', { class: `${prefixCls}-extra` }, props.extra),
        ]
      )
    }

    function renderContent() {
      const attrs = {
        prefixCls: prefixCls,
        isActive: isActive.value,
        destroyInactivePanel: props.destroyInactivePanel,
        forceRender: props.forceRender,
        role: cPorps.accordion ? 'tabpanel' : null,
      }

      return h(
        Transition,
        {
          appear: true,
          css: false,
          ...cState.openAnimation,
        },
        () => withVshow(h(PanelContent, attrs, slots.default), isActive.value)
      )
    }

    return () =>
      h(
        'div',
        {
          role: 'tablist',
          class: {
            [`${prefixCls}-item`]: true,
            [`${prefixCls}-item-active`]: isActive.value,
            [`${prefixCls}-item-disabled`]: props.disabled,
          },
        },
        [renderHeader(), renderContent()]
      )
  },
})
