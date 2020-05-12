const types = [String, Number, Boolean, Array, Object, Date, Function, Symbol]

export function defineProps(defaultProps: any, othersProps: any = {}) {
  const props: any = {}
  Object.keys(defaultProps).forEach((key) => {
    const v = defaultProps[key]
    if (types.includes(v)) {
      props[key] = { type: v }
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
            default:
              Array.isArray(v) && v.every((i) => types.includes(i))
                ? undefined
                : () => v,
            type: Array.isArray(v)
              ? v.every((i) => types.includes(i))
                ? v
                : Array
              : Object,
          }
          break
        case 'function':
          props[key] = { default: v, type: Function }
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

  Object.keys(othersProps).forEach((key) => {
    props[key] = { ...props[key], ...othersProps[key] }
  })
  return props
}
