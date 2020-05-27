import { defineComponent, h } from 'vue'
import { Picker, List } from 'packages'
import ListItem from 'packages/list/ListItem'
export default defineComponent({
  setup() {
    console.log(h(ListItem))

    const seasons = [
      [
        {
          label: '2013',
          value: '2013',
        },
        {
          label: '2014',
          value: '2014',
        },
      ],
      [
        {
          label: '春',
          value: '春',
        },
        {
          label: '夏',
          value: '夏',
        },
      ],
    ]
    return () => {
      return (
        <Picker
          data={seasons}
          title="选择季节"
          cascade={false}
          extra="请选择(可选)"
        >
          <ListItem arrow="horizontal">122</ListItem>
          {/* <List.ListItem arrow="horizontal">111</List.ListItem> */}
        </Picker>
      )
    }
  },
})
