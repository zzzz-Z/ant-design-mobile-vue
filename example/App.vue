<template>
  <TestInput />
  <List />
</template>

<script lang='tsx'>
import { ref, reactive } from 'vue'
import Total from './components/test_taost'
import TestInput from './components/Input.vue'
import List from './components/List.vue'
export default {
  components: {
    TestInput,
    List,
  },
}
</script>

<style lang='less' scoped>
html {
  height: 100%;
  background: #fff;
}
</style>
