<script setup>
import { onMounted, ref } from 'vue'
import { useItems } from './composables/useItems.js'
import ItemList from './components/ItemList.vue'

const {
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
} = useItems('/dataset/items.json')

const selectedItem = ref(null)
const showTable = ref(true)

onMounted(() => {
  loadItems()
})

function handleSelect(item) {
  selectedItem.value = item
}

function reload() {
  selectedItem.value = null
  reset()
  loadItems()
}

/** Демонстрация edge-case: пустой список */
async function loadEmptyCase() {
  selectedItem.value = null
  reset()
  loading.value = true
  error.value = null
  try {
    const response = await fetch('/dataset/edge_cases.json')
    const cases = await response.json()
    const emptyCase = cases.find((c) => c.case === 'empty_list')
    items.value = emptyCase ? emptyCase.items : []
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки edge-case'
    items.value = []
  } finally {
    loading.value = false
  }
}

/** Демонстрация edge-case: отсутствие optional-поля active */
async function loadMissingOptional() {
  selectedItem.value = null
  reset()
  loading.value = true
  error.value = null
  try {
    const response = await fetch('/dataset/edge_cases.json')
    const cases = await response.json()
    const missingCase = cases.find((c) => c.case === 'missing_optional')
    const raw = missingCase ? missingCase.items : []
    items.value = raw.map((item) => ({
      id: item.id,
      title: item.title ?? `Элемент ${item.id}`,
      active: item.active === true
    }))
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки edge-case'
    items.value = []
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <header>
    <div class="brand">Практическая работа 13</div>
    <span>ТРПО · Composition API</span>
  </header>

  <div class="wrap">
    <div class="hero">
      <span class="pill">Vue 3 · script setup · composable</span>
      <h1>Список элементов — Composition API</h1>
      <p class="muted">
        Данные загружаются из <code>dataset/items.json</code>.
        Логика вынесена в composable <code>useItems</code>.
      </p>

      <div class="filters">
        <button
          class="btn"
          :class="{ active: filter === 'all' }"
          :disabled="loading"
          @click="setFilter('all')"
        >
          Все
        </button>
        <button
          class="btn secondary"
          :class="{ active: filter === 'active' }"
          :disabled="loading"
          @click="setFilter('active')"
        >
          Активные
        </button>
        <button
          class="btn secondary"
          :class="{ active: filter === 'inactive' }"
          :disabled="loading"
          @click="setFilter('inactive')"
        >
          Неактивные
        </button>
        <button class="btn secondary" :disabled="loading" @click="reload">
          Перезагрузить
        </button>
      </div>

      <div class="filters">
        <button class="btn secondary" @click="loadEmptyCase">Edge: пустой список</button>
        <button class="btn secondary" @click="loadMissingOptional">Edge: без active</button>
        <button class="btn secondary" @click="showTable = !showTable">
          {{ showTable ? 'Скрыть таблицу' : 'Показать таблицу' }}
        </button>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats" v-if="!loading && !error">
      <div class="stat">
        <div class="label">Всего</div>
        <div class="value">{{ stats.total }}</div>
      </div>
      <div class="stat">
        <div class="label">Активных</div>
        <div class="value">{{ stats.active }}</div>
      </div>
      <div class="stat">
        <div class="label">Неактивных</div>
        <div class="value">{{ stats.inactive }}</div>
      </div>
      <div class="stat">
        <div class="label">Показано</div>
        <div class="value">{{ visibleItems.length }}</div>
      </div>
    </div>

    <!-- Состояния -->
    <div v-if="loading" class="state-box loading">
      Загрузка данных…
    </div>

    <div v-else-if="error" class="state-box error">
      <strong>Ошибка:</strong> {{ error }}
      <div style="margin-top: 12px">
        <button class="btn" @click="reload">Повторить</button>
      </div>
    </div>

    <div v-else-if="isEmpty" class="state-box empty">
      Список пуст. Нет элементов для отображения.
    </div>

    <!-- Карточки -->
    <ItemList
      v-else
      :items="visibleItems"
      @select="handleSelect"
    />

    <!-- Выбранный элемент -->
    <div v-if="selectedItem" class="hero" style="margin-top: 0">
      <span class="pill">выбран</span>
      <h2 style="margin: 0 0 8px">{{ selectedItem.title }}</h2>
      <p class="muted">
        ID: {{ selectedItem.id }} ·
        Статус: {{ selectedItem.active ? 'активен' : 'неактивен' }}
      </p>
    </div>

    <!-- Таблица -->
    <div v-if="showTable && !loading && !error && visibleItems.length" class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in visibleItems" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>
              <span class="pill">{{ item.active ? 'активен' : 'неактивен' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
