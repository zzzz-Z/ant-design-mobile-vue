<template>
  <TestInput />
  <List />
  <Card />
</template>

<script lang='tsx'>
import { ref, reactive } from 'vue'
import Total from './components/test_taost'
import TestInput from './components/Input.vue'
import List from './components/List.vue'
import Card from './components/Card.vue'
export default {
  components: {
    TestInput,
    List,
    Card,
  },
}
</script>

<style lang='less' scoped>
html {
  height: 100%;
  background: #fff;
}
</style>
