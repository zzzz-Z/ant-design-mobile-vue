import { VNode, CSSProperties } from 'vue'

export interface ListPropsType {
  renderHeader?: (() => VNode) | VNode
  renderFooter?: (() => VNode) | VNode
}

export interface ListItemPropsType {
  align?: 'top' | 'middle' | 'bottom'
  disabled?: boolean
  multipleLine?: boolean
  thumb?: VNode | null
  extra?: VNode
  arrow?: 'horizontal' | 'down' | 'up' | 'empty' | ''
  wrap?: boolean
  activeStyle?: CSSProperties
  error?: boolean
  platform?: 'android' | 'ios'
}

export interface BriefProps {
  wrap?: boolean
}
