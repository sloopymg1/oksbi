import tailwindcss from '@tailwindcss/vite'

// Nuxt DevTools / Vite resolve "open in editor" through `launch-editor`, which
// honours LAUNCH_EDITOR. Defaulting it here (instead of in the `dev` script)
// keeps it working no matter how the dev server is started, on any platform.
process.env.LAUNCH_EDITOR ||= 'code'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-17',
  srcDir: 'src/',
  modules: ['./modules/devtools-open-in-editor'],
  devtools: {
    enabled: true,
    disableAuthorization: true,
    // The element picker is provided by ./modules/devtools-open-in-editor
    // instead, which records absolute paths so "open in editor" works from
    // this monorepo. Do not re-enable without reading that module's comment.
    componentInspector: false
  },
  devServer: {
    host: '0.0.0.0'
  },
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