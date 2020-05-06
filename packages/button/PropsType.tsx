export interface ButtonProps {
  type?: 'primary' | 'warning' | 'ghost'
  size?: 'large' | 'small'
  disabled?: boolean
  loading?: boolean
  prefixCls?: string
  className?: string
  role?: string
  inline?: boolean
  icon?: React.ReactNode
  activeClassName?: string
  activeStyle?: boolean | React.CSSProperties
  style?: React.CSSProperties | string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}
