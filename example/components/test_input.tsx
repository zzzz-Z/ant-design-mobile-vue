import { h, defineComponent, reactive } from 'vue'
import { InputItem } from 'antd'

export default defineComponent({
  props: ['value'],
  setup(props) {
    const state = reactive({
      value: '1',
    })
    return () => {
      return [
        h(
          InputItem,
          {
            value: props.value,
            clear: true,
            type: 'money',
            maxLength: 5,
            placeholder: '居右对齐',
          },
          () => '居右对齐'
        ),
        h(
          InputItem,
          {
            value: props.value,
            clear: true,
            placeholder: '居左对齐',
          },
          () => '居左对齐'
        ),
      ]
    }
  },
})
