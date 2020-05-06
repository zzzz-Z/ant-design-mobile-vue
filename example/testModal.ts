import 'packages/style/index'
import { h, defineComponent, reactive, Transition } from 'vue'
import { Button, Modal } from '../packages'
import { useAlert, useOperation } from '../packages/modal'
import Toast from '../packages/toast'

export default defineComponent({
  setup() {
    const state = reactive({
      show: false,
    })
    const click1 = () => (state.value += '1')
    const click = () => {
      Toast.info(h('div', 'zzz'))
      // state.show = !state.show
      // useAlert('zzz', () => h(InputItem, { value: state.value }), [
      //   {
      //     text: '_+++',
      //     onPress: () => {
      //       state.value = state.value + 1
      //       console.log(state)
      //     },
      //   },
      // ])
      // useOperation([
      //   {
      //     text: 'xx',
      //     onPress: (close) => {
      //       return new Promise(r => {
      //         setTimeout(() => {
      //           r()
      //         }, 2000);
      //       })
      //     },
      //   },
      //   { text: '确定' },
      // ])
    }
    return () =>
      h('div', { class: ' v-container' }, [
        h(Button, { onClick: click, type: 'primary' }, () => 'button'),
        h(
          Modal,
          {
            // popup: true,
            transitionName: 'fade-in-linear',
            transparent: true,
            title: 'title',
            // animationType: 'slide-up',
            visible: state.show,
            onClose: () => (state.show = false),
          },
          () => h('div', 111)
        ),
      ])
  },
})
