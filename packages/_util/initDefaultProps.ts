import { Data } from 'packages/interface'

export const initDefaultProps = (propTypes: any, defaultProps: Data = {}) => {
  Object.keys(defaultProps).forEach((k) => {
    if (propTypes[k]) {
      propTypes[k].def && (propTypes[k] = propTypes[k].def(defaultProps[k]))
    } else {
      throw new Error(`not have ${k} prop`)
    }
  })
  return propTypes
}
