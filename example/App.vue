<template>
  <!-- <TestInput /> -->
  <Total />
  <List />
  <!-- <Card /> -->
  <!-- <Flex /> -->
  <!-- <Icon type='check' /> -->
  <!-- <Icon type='loading' /> -->
  <Calendar />
  <!-- <Picker /> -->
</template>

<script lang='tsx'>
import { ref, reactive, getCurrentInstance } from 'vue'
import Total from './components/test_taost'
import TestInput from './components/Input.vue'
import List from './components/List.vue'
import Card from './components/Card.vue'
import Flex from './components/Flex.vue'
import Calendar from './components/Calendar'
import Picker from './components/Picker'
import Test from './test'
export default {
  components: {
    Total,
    Calendar,
    TestInput,
    List,
    Card,
    Picker,
    Flex,
  },

  created() {},
}
</script>

<style lang='less' scoped>
html {
  height: 100%;
  background: #fff;
}
</style>
