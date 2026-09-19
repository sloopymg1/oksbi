import { isAbsolute } from 'node:path'
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { VueTracer } from 'vite-plugin-vue-tracer'

/**
 * Makes the DevTools component inspector open files in the editor from inside
 * this monorepo.
 *
 * `vite-plugin-vue-tracer` records each component's source path relative to the
 * Vite workspace root, which is the repo root here because the root
 * package.json declares npm workspaces. The DevTools `openInEditor` RPC then
 * resolves relative paths against `process.cwd()`, which is services/web. The
 * two disagree, so every click looked for
 * `services/web/services/web/src/...`, missed, and failed silently with
 * "File not found" in the dev server log.
 *
 * Recording absolute paths sidesteps that resolution entirely. We own the
 * tracer instance here instead of letting DevTools add its own -- hence
 * `devtools.componentInspector: false` in nuxt.config.ts. The DevTools UI
 * picks the inspector up either way: it only checks whether any trace data has
 * been recorded.
 */
export default defineNuxtModule({
  meta: { name: 'oksbi:devtools-open-in-editor' },
  setup(_options, nuxt) {
    if (!nuxt.options.dev || nuxt.options.test)
      return

    const tracer = VueTracer()
    const transform = tracer?.transform
    if (typeof transform !== 'function')
      return

    // The plugin appends exactly one `_tracerRecordPosition("<path>", ...)`
    // call per module; the path is a JSON string literal.
    const RECORDED_PATH_RE = /_tracerRecordPosition\("(?:[^"\\]|\\.)*"/

    addVitePlugin({
      ...tracer,
      name: 'oksbi:vue-tracer-absolute-paths',
      transform(code, id, options) {
        const result = transform.call(this, code, id, options)
        const filepath = id.split('?')[0]
        if (!result?.code || !isAbsolute(filepath))
          return result

        return {
          ...result,
          code: result.code.replace(
            RECORDED_PATH_RE,
            () => `_tracerRecordPosition(${JSON.stringify(filepath)}`
          )
        }
      }
    })
  }
})
