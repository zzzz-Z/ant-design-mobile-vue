import Calendar from 'packages/calendar'
import { defineComponent, reactive } from 'vue'
import { Button } from 'packages'

export default defineComponent({
  setup() {
    const now = new Date()
    const state = reactive({
      show: false,
    })
    return () => [
      <Calendar
        onConfirm={(...arg) => {
          console.log(arg);
          state.show = false
        }}
        onCancel={() => {
          state.show = false
        }}
        onSelect={val => {
          console.log(val);
        }}
        enterDirection='horizontal'
        showShortcut
        title='zzzz'
        type="range"
        pickTime
        visible={state.show}
        defaultDate={new Date()}
        minDate={new Date(+now - 5184000000)}
        maxDate={new Date(+now + 31536000000)}
      />,
      <Button onClick={() => (state.show = true)}> click </Button>,
    ]
  },
})
