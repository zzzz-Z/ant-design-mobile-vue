import { createVNode, isVNode } from 'vue'


const slice = Array.prototype.slice

export function jsx(tag: any, props = null, children: any = null) {
  if (arguments.length > 3 || isVNode(children)) {
    children = slice.call(arguments, 2)
  }
  return createVNode(tag, props, children)
}
