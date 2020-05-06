import dialogProps from './IDialogPropTypes'
import { withVshow } from 'packages/utils/directives'
import { defineComponent, h, Transition, Teleport, mergeProps } from 'vue'

const Dialog = defineComponent({
  name: 'Dialog',
  props: dialogProps as any,
  inheritAttrs: false,
  setup(props, { slots, attrs, emit }) {
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
          : h(Transition, { name: maskTransition }, maskElement)
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

    return () =>
      h(
        Teleport,
        { to: getContainer(), disabled: true },
        h(
          Transition,
          {
            name: getTransitionName(),
            onAfterLeave: (e) => emit('leave', e),
          },
          () =>
            props.visible
              ? h('div', [
                  getMaskElement(),
                  h(
                    'div',
                    {
                      style: getWrapStyle(),
                      class: [`${props.prefixCls}-wrap `, props.wrapClassName],
                      onClick: props.maskClosable ? onMaskClick : undefined,
                      role: 'dialog',
                      'aria-labelledby': props.title,
                      ...props.wrapProps,
                    },
                    getDialogElement()
                  ),
                ])
              : null
        )
      )
  },
})

export default Dialog
