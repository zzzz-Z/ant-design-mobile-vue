//@ts-ignore
import { withDirectives,VNode, vShow, ObjectDirective, vModelDynamic, vModelText} from 'vue'

interface OutEl extends HTMLElement {
  _handler(e: Event): void
}
/** as vshow */
export const withVshow = (node: VNode, exp: boolean | undefined) => {
  return withDirectives(node, [[vShow, exp]])
}
/** as vif */
export const withVif = (node: VNode, exp: any) => {
  return exp ? node : null
}

export const withVModel = (node: VNode, arg: any, mods?: any) =>
  withDirectives(node, [[vModelDynamic, arg, '', mods]])
export const withvModelText = (node: VNode, arg: any, mods?: any) =>
  withDirectives(node, [[vModelText, arg, '', mods]])

export const withClickoutside = (node: VNode, cb: (...arg: any) => void) => {
  return withDirectives(node, [[clickoutside, cb]])
}

const clickoutside: ObjectDirective = {
  mounted(el: OutEl, binding) {
    el._handler = (evt) => {
      if (!el.contains(evt.target as HTMLElement)) {
        binding.value(evt)
      }
    }

    document.addEventListener('click', el._handler)
  },
  unmounted(el: OutEl) {
    document.removeEventListener('click', el._handler)
  },
}
