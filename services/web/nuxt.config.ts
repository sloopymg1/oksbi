import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-17',
  srcDir: 'src/',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'OKSBI Workspace',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#17211f' }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap'
        }
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      allowedHosts: true,
      strictPort: false
    }
  },
  routeRules: {
    '/api/**': { proxy: 'http://localhost:7071/**' }
  },
  future: {
    compatibilityVersion: 4
  }
})