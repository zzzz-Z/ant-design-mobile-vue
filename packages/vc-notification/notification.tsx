import Notice from './Notice'
import {
  h,
  defineComponent,
  reactive,
  TransitionGroup,
  createApp,
  ref,
  getCurrentInstance,
  VNode,
} from 'vue'
import { defineProps } from '../_util/vue-types/defineProps'

let seed = 0
const now = Date.now()

function getUuid() {
  return `rcNotification_${now}_${seed++}`
}

export interface NotificationCtx {
  add(notice: NoticeItem): void
  remove(key: string | number): void
}
export interface NoticeItem {
  [key: string]: any
  content: VNode | string
  key?: string | number
}
type Notices = NoticeItem[]

export const Notification = defineComponent({
  props: defineProps({
    prefixCls: 'rmc-notification',
    animation: 'fade',
    style: { top: 65, left: '50%' },
    transitionName: String,
  }),
  setup(props) {
    const notices: Notices = reactive([])
    const ctx = (getCurrentInstance() as any).ctx
    ctx.add = add
    ctx.remove = remove
    const getTransitionName = () => {
      let transitionName = props.transitionName
      if (!transitionName && props.animation) {
        transitionName = `${props.prefixCls}-${props.animation}`
      }
      return transitionName
    }

    function add(notice: NoticeItem) {
      const key = (notice.key = notice.key || getUuid())
      if (!notices.find((v) => v.key === key)) {
        notices.push(notice)
      }
    }

    function remove(key: string | number) {
      notices.find((notice, n) => {
        if (notice.key === key) {
          notices.splice(n, 1)
        }
      })
    }

    return () =>
      h(
        'div',
        { class: props.prefixCls, style: props.style },
        h(TransitionGroup, { name: getTransitionName() }, () =>
          notices.map((notice) =>
            h(
              Notice,
              {
                prefixCls: props.prefixCls,
                onClose: () => remove(notice.key!),
                ...notice,
              },
              () => notice.content
            )
          )
        )
      )
  },
})

export function useNotification(properties: any) {
  const { getContainer, ...props } = properties || {}
  const NotificationRef = ref<any>(null)
  let div: HTMLDivElement
  if (getContainer) {
    div = getContainer()
  } else {
    div = document.createElement('div')
    document.body.appendChild(div)
  }
  const App = createApp(() =>
    h(Notification, { ref: NotificationRef, ...props })
  )
  App.mount(div!)
  return {
    component: NotificationRef,
    notice(noticeProps: NoticeItem) {
      NotificationRef!.value.add(noticeProps)
    },
    removeNotice(key: string | number) {
      NotificationRef!.value.remove(key)
    },
    destroy() {
      App.unmount(div!)
      document.body.removeChild(div!)
    },
  }
}
