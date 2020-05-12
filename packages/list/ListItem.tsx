import { TouchFeedback } from '../feedback'
import {
  BriefProps as BriefBasePropsType,
  ListItemPropsType as ListItemBasePropsType,
} from './PropsType'
import {
  FunctionalComponent,
  reactive,
  onUnmounted,
  nextTick,
  VNodeProps,
  SetupContext,
  h,
} from 'vue'
import { defineProps } from 'packages/_util/vue-types/defineProps'
import { withVif } from 'packages/utils/directives'
import { isFunction } from 'packages/utils/util'

export interface ListItemProps extends ListItemBasePropsType {
  prefixCls?: string
  role?: string
}

export interface BriefProps extends BriefBasePropsType {
  prefixCls?: string
  role?: string
}

export const Brief: FunctionalComponent<BriefProps> = (props, { slots }) => {
  return h('div', { class: 'am-list-brief' }, slots.default?.())
}

const ListItemImpl = {
  name: 'ListItem',
  Brief: Brief,
  inheritAttrs: false,
  props: defineProps({
    prefixCls: 'am-list',
    align: 'middle',
    error: false,
    multipleLine: false,
    wrap: false,
    platform: 'ios',
    extra: undefined,
    activeStyle: Object,
    arrow: String,
  }),
  setup(props: ListItemProps, { emit, slots, attrs }: SetupContext) {
    let debounceTimeout: any
    const state = reactive({
      coverRippleStyle: { display: 'none' } as any,
      RippleClicked: false,
    })

    onUnmounted(() => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
        debounceTimeout = null
      }
    })

    const onClick = (ev: any) => {
      const { platform } = props
      const isAndroid = platform === 'android'
      if (!!attrs.onClick && isAndroid) {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout)
          debounceTimeout = null
        }
        const Item = ev.currentTarget
        const RippleWidth = Math.max(Item.offsetHeight, Item.offsetWidth)
        const ClientRect = ev.currentTarget.getBoundingClientRect()
        const pointX = ev.clientX - ClientRect.left - Item.offsetWidth / 2
        const pointY = ev.clientY - ClientRect.top - Item.offsetWidth / 2
        const coverRippleStyle = {
          width: `${RippleWidth}px`,
          height: `${RippleWidth}px`,
          left: `${pointX}px`,
          top: `${pointY}px`,
        }
        state.coverRippleStyle = coverRippleStyle
        state.RippleClicked = true
        nextTick(() => {
          debounceTimeout = setTimeout(() => {
            state.coverRippleStyle = { display: 'none' }
            state.RippleClicked = false
          }, 1000)
        })
      }
      emit('click', ev)
    }

    return () => {
      const {
        prefixCls,
        activeStyle,
        error,
        align,
        wrap,
        disabled,
        multipleLine,
        thumb,
        extra,
        arrow,
        ...restProps
      } = props
      const { platform, ...otherProps } = restProps
      const { default: defSlot } = slots
      const extraNode = extra || slots.extra

      const wrapCls = [
        `${prefixCls}-item`,
        {
          [`${prefixCls}-item-disabled`]: disabled,
          [`${prefixCls}-item-error`]: error,
          [`${prefixCls}-item-top`]: align === 'top',
          [`${prefixCls}-item-middle`]: align === 'middle',
          [`${prefixCls}-item-bottom`]: align === 'bottom',
        },
      ]

      const rippleCls = [
        `${prefixCls}-ripple`,
        {
          [`${prefixCls}-ripple-animate`]: state.RippleClicked,
        },
      ]

      const lineCls = [
        `${prefixCls}-line`,
        {
          [`${prefixCls}-line-multiple`]: multipleLine,
          [`${prefixCls}-line-wrap`]: wrap,
        },
      ]

      const arrowCls = [
        `${prefixCls}-arrow`,
        {
          [`${prefixCls}-arrow-horizontal`]: arrow === 'horizontal',
          [`${prefixCls}-arrow-vertical`]: arrow === 'down' || arrow === 'up',
          [`${prefixCls}-arrow-vertical-up`]: arrow === 'up',
        },
      ]
      const content = h(
        'div',
        {
          ...otherProps,
          onClick,
          style: attrs.style,
          class: [wrapCls, attrs.class],
        },
        [
          withVif(
            h(
              'div',
              { class: `${prefixCls}-thumb` },
              typeof thumb === 'string' ? h('img', { src: thumb }) : thumb!
            ),
            thumb
          ),
          h('div', { class: [lineCls, '11'] }, [
            defSlot && h('div', { class: `${prefixCls}-content` }, defSlot()),
            extraNode &&
              h(
                'div',
                { class: `${prefixCls}-extra` },
                isFunction(extraNode) ? extraNode() : extraNode
              ),
            arrow && h('div', { class: arrowCls, 'aria-hidden': 'true' }),
          ]),
          h('div', { style: state.coverRippleStyle, class: rippleCls }),
        ]
      )

      const touchProps: any = {}
      Object.keys(attrs).forEach((key) => {
        if (/onTouch/i.test(key)) {
          touchProps[key] = (attrs as any)[key]
        }
      })

      return h(
        TouchFeedback,
        {
          ...touchProps,
          disabled: disabled || attrs.onClick,
          activeStyle,
          activeClassName: `${prefixCls}-item-active`,
        },
        () => content
      )
    }
  },
}

const ListItem = (ListItemImpl as any) as {
  Brief: typeof Brief
  new (): {
    $props: VNodeProps & ListItemProps
  }
}
export default ListItem
