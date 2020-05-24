/* tslint:disable:no-console */
import { IPickerProps } from './PickerTypes'
import { VNode, FunctionalComponent } from 'vue'

export interface IItemProps {
  className?: string
  key?: string | number
  value: any
  children?: VNode
}

const computeChildIndex = (
  top: number,
  itemHeight: number,
  childrenLength: number
) => {
  const index = Math.round(top / itemHeight)
  return Math.min(index, childrenLength - 1)
}

const selectByIndex = (
  children: VNode[] = [],
  index: number,
  itemHeight: number,
  zscrollTo: (n: number) => void
) => {
  if (index < 0 || index >= children.length - 1 || !itemHeight) {
    return
  }
  zscrollTo(index * itemHeight)
}

const doScrollingComplete = (children: VNode[] = []) => (
  top: number,
  itemHeight: number,
  fireValueChange: (arg0: any) => void
) => {
  const index = computeChildIndex(top, itemHeight, children.length)
  const child = children[index]
  if (child) {
    fireValueChange(child.props?.value)
  } else if (console.warn) {
    console.warn('child not found', children, index)
  }
}

const select = (children: VNode[] = []) => (
  value: any,
  itemHeight: number,
  scrollTo: (n: number) => void
) => {
  for (let i = 0, len = children.length; i < len; i++) {
    if (children[i]!.props?.value === value) {
      selectByIndex(children, i, itemHeight, scrollTo)
      return
    }
  }
  selectByIndex(children, 0, itemHeight, scrollTo)
}

export default function PickerMixin(ComposedComponent: any) {
  const PickerVc: FunctionalComponent<IPickerProps> = (props, { slots }) => {
    const children = slots.default?.()
    return (
      <ComposedComponent
        {...props}
        doScrollingComplete={doScrollingComplete(children)}
        computeChildIndex={computeChildIndex}
        select={select(children)}
      >
        {slots.default?.()}
      </ComposedComponent>
    )
  }

  return PickerVc
}
