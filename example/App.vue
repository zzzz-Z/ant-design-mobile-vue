<template>
  <TestInput />
  <List />
  <TestJsx @click="()=>''" name='q111' age='222'>
  <List />
  </TestJsx>
</template>

<script lang='tsx'>
import { ref, reactive } from 'vue'
import Total from './components/test_taost'
import TestInput from './components/Input.vue'
import List from './components/List.vue'
import TestJsx from './test';
export default {
  components: {
    TestInput,
    List,
    TestJsx
  },
}
</script>

<style lang='less' scoped>
html {
  height: 100%;
  background: #fff;
}
</style>
