<template>
  <List renderHeader="111" renderFooter="222">
    <Picker
      title="选择季节"
      :cascade="false"
      extra="请选择(可选)"
      :data="state"
    >
      <ListItem arrow="horizontal" extra="dddd">
        Title
      </ListItem>
    </Picker>
    <ListItem arrow="horizontal" extra="dddd">
      Title
    </ListItem>
  </List>
</template>
<script >
import { ref, reactive, getCurrentInstance } from 'vue'
import { List,Picker } from 'packages'

export default {
  components: {
    List,
    Picker,
    ListItem: List.ListItem,
  },
  setup() {
    const state = reactive( [
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
    ])
    const change = (val) => {
      console.log(val)
    }
    const click = () => {
      state.value = state.value + 1
    }

    return {
      state,
      change,
      click,
    }
  },
}
</script>
