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

app.use(vuetify)

app.mount('#app')
