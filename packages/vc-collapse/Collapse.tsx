import {
  defineComponent,
  watch,
  h,
  computed,
  getCurrentInstance,
  provide,
} from 'vue'
import animation from './openAnimationFactory'
import { initDefaultProps } from 'packages/_util/initDefaultProps'
import {
  VcCollapseProps,
  collapseProps,
  CollapseInjectionKey,
} from './interface'
import useStateWithCtx from 'packages/utils/useStateWithCtx'

export default defineComponent<VcCollapseProps>({
  name: 'Collapse',
  emits: ['change'],
  props: initDefaultProps(collapseProps(), {
    prefixCls: 'rc-collapse',
    accordion: false,
    destroyInactivePanel: false,
  }),
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance()
    const defaultActiveKey = props.accordion ? '' : []
    const state = useStateWithCtx({
      activeKey: props.activeKey || defaultActiveKey,
      onClickItem,
      openAnimation: computed(
        () => props.openAnimation || animation(props.prefixCls)
      ),
    })

    provide(CollapseInjectionKey, instance)

    watch(
      () => props.activeKey,
      (val) => {
        state.activeKey = val!
      }
    )

    function onClickItem(key: string) {
      let activeKey = state.activeKey as any
      if (props.accordion) {
        activeKey = activeKey === key ? undefined : key
      } else {
        activeKey = [...activeKey]
        const index = activeKey.indexOf(key)
        const isActive = index > -1
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1)
        } else {
          activeKey.push(key)
        }
      }
      state.activeKey = activeKey
      emit('change', activeKey)
    }

    return () =>
      h(
        'div',
        {
          class: props.prefixCls,
          role: props.accordion ? 'tablist' : null,
        },
        slots.default?.()
      )
  },
})
