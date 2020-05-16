import Layout from './Layout.vue'
import Input from '../../example/components/Input.vue'
import List from '../../example/components/List.vue'

export default {
  Layout,
  NotFound: () => '404 ;<',
  enhanceApp({ app, router, siteData }) {
    app.provide('router', router)
    app.component('Input', Input)
    app.component('List', List)
  },
}
