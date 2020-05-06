const types = [String, Number, Boolean, Array, Object, Date, Function, Symbol]
export function defineProps(defaultProps: any) {
  const props: any = {}
  Object.keys(defaultProps).forEach((key) => {
    const v = defaultProps[key]
    if (types.includes(v)) {
      props[key] = v
    } else {
      switch (typeof v) {
        case 'string':
          props[key] = { default: v, type: String }
          break
        case 'number':
          props[key] = { default: v, type: Number }
          break
        case 'boolean':
          props[key] = { default: v, type: Boolean }
          break
        case 'object':
          props[key] = {
            default: () => v,
            type: Array.isArray(v) ? Array : Object,
          }
          break
        case 'function':
          /** 如果有返回值 则返回值为类型 */
          props[key] = v?.() ? v() : { default: v, type: Function }
          break
        case 'symbol':
          props[key] = { default: v, type: Symbol }
          break

        default:
          props[key] = {
            validator: () => {
              return true
            },
          }
          break
      }
    }
  })
  return props
}
