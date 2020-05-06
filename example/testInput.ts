import { h } from 'vue'
import { InputItem } from 'packages'

export const testInput = (props: any) => {
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
        value: props.value1,
        clear: true,
        placeholder: '居左对齐',
      },
      () => '居左对齐'
    ),
  ]
}
