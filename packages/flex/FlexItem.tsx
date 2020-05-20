import { FlexItemPropsType } from './PropsType'
import { FunctionalComponent } from 'vue'

const prefixCls = 'am-flexbox'

const FlexItem: FunctionalComponent<FlexItemPropsType> = (_, { slots }) => (
  <div class={`${prefixCls}-item`}>{slots.default?.()}</div>
)

FlexItem.displayName = 'FlexItem'

export default FlexItem
