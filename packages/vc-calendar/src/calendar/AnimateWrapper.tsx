import { FunctionalComponent } from 'vue'

export interface PropsType {
  visible: boolean
  className?: string
  displayType?: string
}

const AnimateWrapper: FunctionalComponent<PropsType> = (props, { slots }) => {
  const { className = '', displayType = 'flex', visible } = props

  return (
    <div
      class={className + ' animate'}
      style={{ display: visible ? displayType : 'none' }}
    >
      {visible && slots.default?.()}
    </div>
  )
}
AnimateWrapper.displayName = 'AnimateWrapper'

export default AnimateWrapper
