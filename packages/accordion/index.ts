import { VcCollapse, VcPanel } from '../vc-collapse'
import { h, VNode, FunctionalComponent } from 'vue'

export interface AccordionProps {
  activeKey?: string | number | (string | number)[]
  prefixCls?: string
  openAnimation?: object
  accordion?: boolean
  destroyInactivePanel?: boolean
  expandIcon?: (props: object) => VNode
  onChange?(val: string | string[]): void
}

const Accordion: FunctionalComponent<AccordionProps> = (props, { slots }) => {
  return h(VcCollapse, { prefixCls: 'am-accordion', ...props }, () =>
    slots.default?.()
  )
}

export const Panel = VcPanel

export default Accordion
