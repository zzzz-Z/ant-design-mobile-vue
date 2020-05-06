import { h, defineComponent } from 'vue'
import TestToast from './test_taost'
import Icon from '../packages/icon'
export default defineComponent({
  setup() {
    return () => [h(Icon, { type: 'plus' }), h(TestToast)]
  },
})
