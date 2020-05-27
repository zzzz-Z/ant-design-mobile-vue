import { FunctionalComponent } from 'vue'

export interface PropsType {
  class?: any
  displayType?: string
}

const AnimateWrapper: FunctionalComponent<PropsType> = (props, { slots }) => {
  return (
    <div class={'animate'} style={{ display: 'flex' }}>
      {slots.default?.()}
    </div>
  )
}

export default AnimateWrapper
