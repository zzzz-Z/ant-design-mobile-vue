<template>
  <!-- <TestInput /> -->
  <Total />
  <!-- <List /> -->
  <!-- <Card /> -->
  <Modal />
  <!-- <Icon type='check' /> -->
  <!-- <Icon type='loading' /> -->
  <Calendar />
</template>

<script lang='tsx'>
import { ref, reactive, getCurrentInstance } from 'vue'
import Total from './components/test_taost'
import Modal from './components/test_modal'
import TestInput from './components/Input.vue'
import List from './components/List.vue'
import Card from './components/Card.vue'
import Flex from './components/Flex.vue'
import Calendar from './components/Calendar'

export default {
  components: {
    Total,
    Calendar,
    TestInput,
    List,
    Card,
    Modal,
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
