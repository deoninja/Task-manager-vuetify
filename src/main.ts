import { createApp } from 'vue'
import App from './App.vue'
import vuetify from '../plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
