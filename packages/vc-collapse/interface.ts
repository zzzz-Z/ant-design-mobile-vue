import { VNode, ComponentInternalInstance } from 'vue'
import PropTypes from 'packages/_util/vue-types'

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

export const collapseProps = () => ({
  prefixCls: PropTypes.string,
  activeKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  defaultActiveKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  accordion: PropTypes.bool,
  destroyInactivePanel: PropTypes.bool,
  bordered: PropTypes.bool,
  expandIcon: PropTypes.func,
  openAnimation: PropTypes.object,
  expandIconPosition: PropTypes.oneOf(['left', 'right']),
})

export const panelProps = () => ({
  openAnimation: PropTypes.object,
  prefixCls: PropTypes.string,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  headerClass: PropTypes.string,
  showArrow: PropTypes.bool,
  isActive: PropTypes.bool,
  destroyInactivePanel: PropTypes.bool,
  disabled: PropTypes.bool,
  accordion: PropTypes.bool,
  forceRender: PropTypes.bool,
  expandIcon: PropTypes.func,
  extra: PropTypes.any,
  panelKey: PropTypes.any,
})
