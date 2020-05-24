import { h, defineComponent, getCurrentInstance } from 'vue'
import { Button, WingBlank, WhiteSpace, Toast, Icon } from 'antd'

function click(key: number) {
  switch (key) {
    case 1:
      Toast.info('This is a toast tips !!!', 1)
      break
    case 2:
      Toast.info('Toast without mask !!!', 2, () => {}, false)

      break
    case 3:
      Toast.offline('Network connection failed !!!', 1)

      break
    case 4:
      Toast.loading('Loading...', 1, () => {
        console.log('Load complete !!!')
      })
      break
    case 5:
      Toast.success('Load success !!!', 1)
      break
    case 6:
      Toast.fail('Load failed !!!', 1)
      break

    default:
      break
  }
}

export default defineComponent({
  props: {
    // onClick: Function,
  },
  setup(_, { slots, attrs, emit }) {
    const v = getCurrentInstance()
    console.log(v);
    console.log({ ..._ })
    console.log({ ...attrs })
    return () =>
      h(WingBlank, () =>
        [1, 2, 3, 4, 5, 6].map((n) => (
          <>
            <WhiteSpace />
            <Button
              onClick={() => {
                // click(n)
                emit('click')
              }}
            >
              <Icon type="check" />
            </Button>
          </>
        ))
      )
  },
})
