import { CardPropsType } from './PropsType'
import { FunctionalComponent, VNode } from 'vue'
import { isFunction } from 'packages/utils/util'

type Node = string | VNode | (() => VNode)

export interface CardProps extends CardPropsType {
  full?: boolean
  extra?: Node
  header?: Node
  footer?: Node
  footerExtra?: Node
}

const prefixCls = 'am-card'

const Card: FunctionalComponent<CardProps> = (props, { slots }) => {
  const header = props.header || slots.header
  const footer = props.footer || slots.footer
  const extra = props.extra || slots.extra
  const footerExtra = props.footerExtra || slots.footerExtra
  const headerEl = isFunction(header) ? header() : header
  const footerEl = isFunction(footer) ? footer() : footer
  const extraEl = isFunction(extra) ? extra() : extra
  const footerExtraEl = isFunction(footerExtra) ? footerExtra() : footerExtra
  return (
    <div
      class={[
        prefixCls,
        {
          [`am-card-full`]: props.full,
        },
      ]}
    >
      {header && (
        <div class="am-card-header">
          {headerEl}
          {extra && <div class={`${prefixCls}-header-extra`}>{extraEl}</div>}
        </div>
      )}
      <div class="am-card-body"> {slots.default?.()} </div>
      {footer && (
        <div class="am-card-footer">
          <div class={`${prefixCls}-footer-content`}> {footerEl}</div>
          {footerExtra && (
            <div class={`${prefixCls}-footer-extra`}>{footerExtraEl}</div>
          )}
        </div>
      )}
    </div>
  )
}

Card.displayName = 'Card'

export default Card
