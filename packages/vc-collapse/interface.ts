import { VNode, ComponentInternalInstance } from 'vue'
import { defineProps } from '../_util/vue-types/defineProps'

export const CollapseInjectionKey = Symbol()
export interface CollapseInstance extends ComponentInternalInstance {
  ctx: {
    _state: {
      activeKey: string | string[]
      onClickItem: (key: string) => void
      openAnimation: object & {}
    }
  }
}

export interface VcCollapseProps {
  activeKey?: string | number | (string | number)[]
  prefixCls?: string
  openAnimation?: object
  accordion?: boolean
  destroyInactivePanel?: boolean
  expandIcon?: (props: object) => VNode
  onChange?(val: string | string[]): void
}

export const collapseProps = defineProps({
  prefixCls: 'rc-collapse',
  accordion: false,
  destroyInactivePanel: false,
  activeKey: [String, Number, Array],
  defaultActiveKey: [String, Number, Array],
  bordered: Boolean,
  expandIcon: Function,
  openAnimation: Object,
  expandIconPosition: String,
})

export const panelProps = defineProps({
  showArrow: true,
  isActive: false,
  destroyInactivePanel: false,
  headerClass: '',
  forceRender: false,
  openAnimation: Object,
  prefixCls: String,
  header: null,
  disabled: Boolean,
  accordion: Boolean,
  expandIcon: Function,
  extra: null,
  panelKey: null,
})
