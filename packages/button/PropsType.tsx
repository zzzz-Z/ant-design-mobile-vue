import { VNode, CSSProperties, Events } from 'vue'

export interface ButtonProps {
  type?: 'primary' | 'warning' | 'ghost'
  size?: 'large' | 'small'
  disabled?: boolean
  loading?: boolean
  prefixCls?: string
  role?: string
  inline?: boolean
  icon?: VNode | string
  activeClassName?: string
  activeStyle?: boolean | CSSProperties
  style?: CSSProperties | string
  onClick?: (evt: Events['onClick']) => void
}
