import { getCurrentInstance } from 'vue'
import { Data } from 'packages/interface'

export default function bindCtx<T extends Data>(methods: T) {
  //@ts-ignore
  const ctx = getCurrentInstance()!.ctx
  Object.keys(methods).forEach((fn) => {
    ctx[fn] = methods[fn]
  })
  return methods
}
