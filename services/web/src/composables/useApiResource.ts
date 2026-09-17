export function useApiResource<T>(loader: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null

    try {
      data.value = await loader()
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : 'Unable to load data.'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return {
    data,
    loading,
    error,
    reload: load
  }
}