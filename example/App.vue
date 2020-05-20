<template>
  <TestInput />
  <List />
  <Card />
  <Flex />
</template>

<script lang='tsx'>
import { ref, reactive, getCurrentInstance } from 'vue'
import Total from './components/test_taost'
import TestInput from './components/Input.vue'
import List from './components/List.vue'
import Card from './components/Card.vue'
import Flex from './components/Flex.vue'
export default {
  components: {
    TestInput,
    List,
    Card,
    Flex
  },
  setup() {
    console.log(getCurrentInstance())
  },
}
</script>

<style lang='less' scoped>
html {
  height: 100%;
  background: #fff;
}
</style>
