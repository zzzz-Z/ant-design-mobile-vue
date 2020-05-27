import { VNode, CSSProperties } from 'vue'

export interface ListPropsType {
  renderHeader?: JSX.Element
  renderFooter?: JSX.Element
}

export interface ListItemPropsType {
  align?: 'top' | 'middle' | 'bottom'
  disabled?: boolean
  multipleLine?: boolean
  thumb?: JSX.Element
  extra?: JSX.Element
  arrow?: 'horizontal' | 'down' | 'up' | 'empty' | ''
  wrap?: boolean
  activeStyle?: CSSProperties
  error?: boolean
  platform?: 'android' | 'ios'
}

export interface BriefProps {
  wrap?: boolean
}
