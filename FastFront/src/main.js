/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Importa os estilos do Vuetify
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'; // Importa o CSS do Vue3Toastify
import router from './router'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark', 
        themes: {
          dark: {
            dark: true,
            colors: {
              background: '#000000', 
              surface: '#121212',
              primary: '#1E88E5', 
              secondary: '#FFC107', 
            },
          },
        },
      },
  components,
  directives,
})

const app = createApp(App)

registerPlugins(app)

app.use(toast, {
  autoclose: 3000,
});
app.use(vuetify)
app.use(router);

app.mount('#app')
