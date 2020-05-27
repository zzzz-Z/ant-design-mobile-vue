import { defineComponent, Text, Fragment } from 'vue'
import { Picker, List } from 'packages'
export default defineComponent({
  setup() {
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
        <List renderHeader="zzz" renderFooter="sss">
          <Picker
            data={seasons}
            title="选择季节"
            cascade={false}
            extra="请选择(可选)"
          >
            <List.ListItem arrow="horizontal" extra="ddd">
              <span color='red'>222</span>
            </List.ListItem>
          </Picker>
        </List>
      )
    }
  },
})
