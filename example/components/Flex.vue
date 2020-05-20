<template>
  <Flex>
    <FlexItem>111</FlexItem>
    <FlexItem>111</FlexItem>
    <FlexItem>111</FlexItem>
  </Flex>
</template>
<script >
import { ref, reactive, getCurrentInstance } from 'vue'
import { Flex } from '../../packages'

console.log(Flex.Item);
export default {
  components: {
    Flex,
    FlexItem:Flex.Item
  },

}
</script>
