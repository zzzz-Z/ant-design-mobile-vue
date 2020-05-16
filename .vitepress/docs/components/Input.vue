<template>
  <WingBlank>
    <InputItem
      type="money"
      placeholder="居右对齐"
      clear
      v-model="state.value"
      @change="change"
    >
      数字input
    </InputItem>
    <InputItem type="phone" placeholder="phone" clear v-model="state.value">
      phone
    </InputItem>
    <InputItem
      @input="change"
      style="color: red;"
      type="number"
      placeholder="number"
      clear
      v-model="state.value"
    >
      number
    </InputItem>
    <white-space />
    <InputItem
      clear
      placeholder="居左对齐"
      v-model="state.value"
      @change="change"
    >
      居左对齐
    </InputItem>
    <white-space />
    <Button type="danger" @click="click">click</Button>
  </WingBlank>
</template>
<script >
import { ref, reactive, getCurrentInstance } from 'vue'
import { InputItem, Button, WhiteSpace, WingBlank } from '../../../packages/index.ts'

export default {
  components: {
    InputItem,
    Button,
    WingBlank,
    WhiteSpace,
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
