//@ts-ignore
import cssAnimation from 'css-animation'

function animate(
  node: { style: { height: string | number }; offsetHeight: any },
  show: boolean,
  transitionName: string,
  done: () => void
) {
  let height: any
  return cssAnimation(node, transitionName, {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`
      } else {
        height = node.offsetHeight
        node.style.height = 0
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`
    },
    end() {
      node.style.height = ''
      done()
    },
  })
}

function animation(prefixCls: any) {
  return {
    onEnter(node: any, done: any) {
      return animate(node, true, `${prefixCls}-anim`, done)
    },
    onLeave(node: any, done: any) {
      return animate(node, false, `${prefixCls}-anim`, done)
    },
  }
}

export default animation
