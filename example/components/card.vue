<template>
  <card>
    <template #header>
      custom header
    </template>
    <template #extra>
      custom extra
    </template>
    <template #footer>
      custom footer
    </template>
    card
  </card>
</template>
<script >
import { ref, reactive, getCurrentInstance } from 'vue'
import { Card } from '../../packages'


export default {
  components: {
    Card,
  },

}
</script>
