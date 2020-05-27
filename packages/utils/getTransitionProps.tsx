//@ts-ignore
import animate from 'css-animation'
import { TransitionProps, TransitionGroupProps } from 'vue'
const noop = () => {}
const getTransitionProps = (
  name: string,
  opt: TransitionProps | TransitionGroupProps = {}
) => {
  const transitionProps: TransitionProps = {
    appear: true,
    css: false,
    onBeforeEnter: noop,
    onAfterEnter: noop,
    onAfterLeave: noop,
    onEnter: (el, done) => {
      console.log(name);
      animate(el, `${name}-enter`, done)
    },
    onLeave: (el, done) => {
      console.log(name)
      animate(el, `${name}-leave`, done)
    },
    ...opt,
  }
  const tag = (opt as TransitionGroupProps).tag
  if (tag) {
    ;(transitionProps as TransitionGroupProps).tag = tag
  }
  return transitionProps
}

export default getTransitionProps
