import { getCurrentInstance, VNode } from 'vue'
import { isFunction } from './util'

export default function getNodeFromCtx(
  name: string
): [boolean, () => undefined | string | VNode] {
  const { props, slots } = getCurrentInstance()!
  const node = props[name] || slots[name]
  return [!!node, () => (isFunction(node) ? node() : node)]
}
