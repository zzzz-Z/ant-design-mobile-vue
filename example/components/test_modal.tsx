import 'packages/style/index'
import { h, defineComponent, reactive, Transition } from 'vue'
import { Button, Modal, Toast } from 'antd'
import getTransitionProps from 'packages/utils/getTransitionProps'

export default defineComponent({
  setup() {
    const state = reactive({
      show: false,
    })

    const click = () => {
      // Toast.info(h('div', 'zzz'))
      state.show = !state.show
    }

    return () => [
      <div>
        <Button onClick={click} type="primary">
          button
        </Button>
        <Transition {...getTransitionProps('zoom')}>
          {state.show ? <div>111111111111</div> : null}
        </Transition>
      </div>
    ]
    // h('div', { class: ' v-container' }, [
    //   h(Button, { onClick: click, type: 'primary' }, () => 'button'),
    //   h(
    //     Modal,
    //     {
    //       popup: true,
    //       transitionName: 'fade-in-linear',
    //       transparent: true,
    //       title: 'title',
    //       animationType: 'slide-up',
    //       visible: state.show,
    //       onClose: () => (state.show = false),
    //     },
    //     () => h('div', 111)
    //   ),
    // ])
  },
})
