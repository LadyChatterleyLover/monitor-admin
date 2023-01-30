import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/base.css'

import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import VXETable from 'vxe-table'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
import 'vxe-table/lib/style.css'

import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(VXETable)
app.use(router)

app.mount('#app')
