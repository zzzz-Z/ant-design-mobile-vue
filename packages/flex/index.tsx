import FlexImpl, { FlexProps } from './Flex'
import FlexItem from './FlexItem'
import { VNodeProps } from 'vue'

FlexImpl.Item = FlexItem

const Flex = (FlexImpl as any) as {
  Item: typeof FlexItem
  new (): { $props: VNodeProps & FlexProps }
}

export { FlexItem }
export default Flex
