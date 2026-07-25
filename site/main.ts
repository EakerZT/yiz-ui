import { createApp } from 'vue'
import yiz from 'yiz-ui'
import App from './App.vue'
import DemoCard from './components/docs/DemoCard.vue'
import 'yiz-ui/style.less'
createApp(App).use(yiz).component('DemoCard', DemoCard).mount('#app')
