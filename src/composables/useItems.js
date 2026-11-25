import { ref, computed } from 'vue'

/**
 * Composable для загрузки, фильтрации и управления списком элементов.
 * Не зависит от HTML-разметки — возвращает только состояние и операции.
 */
export function useItems(sourceUrl = '/dataset/items.json') {
  const items = ref([])
  const filter = ref('all') // 'all' | 'active' | 'inactive'
  const loading = ref(false)
  const error = ref(null)

  const visibleItems = computed(() => {
    const list = items.value
    if (filter.value === 'active') {
      return list.filter((item) => item.active === true)
    }
    if (filter.value === 'inactive') {
      return list.filter((item) => item.active !== true)
    }
    return list
  })

  const stats = computed(() => {
    const list = items.value
    const total = list.length
    const active = list.filter((item) => item.active === true).length
    const inactive = total - active
    return { total, active, inactive }
  })

  const isEmpty = computed(() => !loading.value && !error.value && visibleItems.value.length === 0)

  async function loadItems(url = sourceUrl) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Ожидался массив элементов')
      }
      // Нормализация: active может отсутствовать (edge case)
      items.value = data.map((item) => ({
        id: item.id,
        title: item.title ?? `Элемент ${item.id}`,
        active: item.active === true
      }))
    } catch (e) {
      error.value = e.message || 'Неизвестная ошибка загрузки'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  function setFilter(value) {
    filter.value = value
  }

  function reset() {
    filter.value = 'all'
    error.value = null
  }

  return {
    items,
    filter,
    loading,
    error,
    visibleItems,
    stats,
    isEmpty,
    loadItems,
    setFilter,
    reset
  }
}
