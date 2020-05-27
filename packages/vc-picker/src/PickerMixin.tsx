/* tslint:disable:no-console */
import { IPickerProps } from './PickerTypes'
import { VNode, defineComponent, getCurrentInstance } from 'vue'

export interface IItemProps {
  className?: string
  key?: string | number
  value: any
  children?: JSX.Element
}

export default function PickerMixin() {
  const children = getCurrentInstance()?.slots!.default?.()!

  const computeChildIndex = (
    top: number,
    itemHeight: number,
    childrenLength: number
  ) => {
    const index = Math.round(top / itemHeight)
    return Math.min(index, childrenLength - 1)
  }

  const selectByIndex = (
    index: number,
    itemHeight: number,
    zscrollTo: (n: number) => void
  ) => {
    if (index < 0 || index >= children.length - 1 || !itemHeight) {
      return
    }
    zscrollTo(index * itemHeight)
  }

  const doScrollingComplete = (
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

  const select = (
    value: any,
    itemHeight: number,
    scrollTo: (n: number) => void
  ) => {
    for (let i = 0, len = children.length; i < len; i++) {
      if (children[i]!.props?.value === value) {
        selectByIndex(i, itemHeight, scrollTo)
        return
      }
    }
    selectByIndex(0, itemHeight, scrollTo)
  }

  return {
    select,
    computeChildIndex,
    doScrollingComplete,
  }
}
