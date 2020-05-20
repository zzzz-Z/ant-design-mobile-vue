import { createApp } from 'vue'
import App from './App.vue'
import { jsx } from '../plugins/vueJsxCompat'
import { Fragment } from 'vue'
;(window as any).jsx = jsx
;(window as any).JsxFragment = Fragment

createApp(App).mount('#app')
