import { dialogProps, IDialogPropTypes } from './IDialogPropTypes'
import { withVshow } from 'packages/utils/directives'
import {
  defineComponent,
  h,
  Transition,
  Teleport,
  mergeProps,
  ref,
  reactive,
} from 'vue'
import getTransitionProps from 'packages/utils/getTransitionProps'

const Dialog = defineComponent<IDialogPropTypes>({
  name: 'Dialog',
  props: dialogProps as any,
  inheritAttrs: false,
  setup(props, { slots, attrs, emit }) {
    const wrapRef = ref<HTMLDivElement | null>(null)
    const rootRef = ref<HTMLDivElement | null>(null)
    const state = reactive({ visible: props.visible })

    function getZIndexStyle() {
      const style: any = {}
      if (props.zIndex !== undefined) {
        style.zIndex = props.zIndex
      }
      return style
    }

    function getWrapStyle() {
      const wrapStyle = props.wrapStyle || {}
      return { ...getZIndexStyle(), ...wrapStyle }
    }

    function getMaskStyle() {
      const maskStyle = props.maskStyle || {}
      return { ...getZIndexStyle(), ...maskStyle }
    }

    function getMaskTransitionName() {
      let transitionName = props.maskTransitionName
      const animation = props.maskAnimation
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`
      }
      return transitionName
    }

    function getTransitionName() {
      let transitionName = props.transitionName
      const animation = props.animation
      if (!transitionName && animation) {
        transitionName = `${props.prefixCls}-${animation}`
      }
      return transitionName
    }

    function getMaskElement() {
      let maskElement
      if (props.mask) {
        const maskTransition = getMaskTransitionName()
        maskElement = withVshow(
          h('div', {
            style: getMaskStyle(),
            key: 'mask-element',
            class: `${props.prefixCls}-mask`,
            ...props.maskProps,
          }),
          props.visible
        )
        return maskTransition
          ? maskElement
          : h(Transition, getTransitionProps(maskTransition!), maskElement)
      }
    }

    function getContainer(): HTMLElement {
      return document.body
    }

    function getDialogElement() {
      const { closable, prefixCls } = props
      const footerNode = props.footer || slots.footer
      const headerNode = props.title || slots.title
      let footer: any
      let header: any
      let closer: any

      if (footerNode) {
        footer = h(
          'div',
          { class: `${prefixCls}-footer` },
          props.footer || slots.footer?.()
        )
      }

      if (headerNode) {
        header = h(
          'div',
          { class: `${prefixCls}-header` },
          h(
            'div',
            { class: `${prefixCls}-title` },
            props.title || slots.title?.()
          )
        )
      }

      if (closable) {
        closer = h(
          'button',
          {
            onClick: () => emit('close'),
            'aria-label': 'Close',
            class: `${prefixCls}-close`,
          },
          h('span', { class: `${prefixCls}-close-x` })
        )
      }

      return h(
        'div',
        mergeProps(attrs, {
          key: 'dialog-element',
          role: 'document',
          class: prefixCls,
        }),
        h('div', { class: `${prefixCls}-content` }, [
          closer,
          header,
          h(
            'div',
            {
              class: `${prefixCls}-body`,
              style: props.bodyStyle,
            },
            slots.default?.()
          ),
          footer,
        ])
      )
    }

    function onMaskClick(e: any) {
      if (e.target === e.currentTarget) {
        emit('change', false)
        emit('close', e)
      }
    }

    function onAfterLeave() {
      document.body.style.overflow = ''
      const wrapDiv = wrapRef.value
      if (wrapDiv) {
        wrapDiv.style.display = 'none'
      }
      rootRef.value = null
      emit('animateLeave')
      props.afterClose?.()
    }

    function getComponent() {
      const rootDiv = rootRef.value
      if (props.visible || rootDiv) {
        const wrapStyle = getWrapStyle()
        const name = getTransitionName()!
        const transitionProps = getTransitionProps(name, { onAfterLeave })
        wrapStyle.display = null

        return (
          <Teleport to={getContainer()}>
            <div ref={rootRef}>
              {getMaskElement()}
              <div
                ref={wrapRef}
                style={wrapStyle}
                class={[`${props.prefixCls}-wrap `, props.wrapClassName]}
                onClick={props.maskClosable ? onMaskClick : undefined}
                role="dialog"
                {...props.wrapProps}
              >
                <Transition {...transitionProps}>
                  {props.visible ? getDialogElement() : null}
                </Transition>
              </div>
            </div>
          </Teleport>
        )
      } else {
        return null
      }
    }

    return getComponent
  },
})

export default Dialog
