import { reactive, getCurrentInstance } from 'vue'

export default function useStateWithCtx<T extends object>(state: T) {
  const ctx = getCurrentInstance()!.ctx
  const _state = reactive(state)
  ctx._state = _state

  return _state
}
