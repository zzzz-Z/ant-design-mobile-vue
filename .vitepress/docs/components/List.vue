<template>
  <List renderHeader="111" renderFooter="222">
    <ListItem
      z="ss"
      @change="change"
      @click="click"
      arrow="horizontal"
      extra="dddd"
      >Title
      </ListItem>
  </List>
</template>
<script >
import { ref, reactive, getCurrentInstance } from 'vue'
import { List } from '../../../packages/index.ts'

export default {
  components: {
    List,
    ListItem: List.ListItem,
  },
  setup() {
    const state = reactive({
      value: 1,
    })
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
