import { Data } from 'packages/interface'
import { hasProps } from './util'

export function useDefaultProps<P extends any, D extends Data>(
  props: P,
  defaultProps: D
) {
  Object.keys(defaultProps).forEach((key) => {
    hasProps(key, props) || (props[key] = defaultProps[key])
  })

  return props
}
