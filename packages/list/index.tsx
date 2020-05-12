import './style'
import { h, VNodeProps, SetupContext } from 'vue'
import { ListPropsType } from './PropsType'
import ListItem from './ListItem'
import { isFunction } from 'packages/utils/util'
export interface ListProps extends ListPropsType {
  prefixCls?: string
  role?: string
}

const ListImpl = (props: ListProps, { slots }: SetupContext) => {
  const { renderHeader, renderFooter, ...restProps } = props
  const prefixCls = props.prefixCls || 'am-list'
  return h('div', { class: prefixCls, ...restProps }, [
    renderHeader &&
      h(
        'div',
        { class: `${prefixCls}-header` },
        isFunction(renderHeader) ? renderHeader() : renderHeader
      ),
    slots.default && h('div', { class: `${prefixCls}-body` }, slots.default()),
    renderFooter &&
      h(
        'div',
        { class: `${prefixCls}-header` },
        isFunction(renderFooter) ? renderFooter() : renderFooter
      ),
  ])
}

ListImpl.displayName = 'List'
ListImpl.ListItem = ListItem

const List = (ListImpl as any) as {
  ListItem: typeof ListItem
  new (): {
    $props: VNodeProps & ListProps
  }
}

export { ListItem }
export default List
