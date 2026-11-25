# Практическая работа №13  
## Vue 3. Переход с Options API на Composition API

**Дисциплина:** Технологии разработки программного обеспечения  
**Институт:** Институт перспективных технологий и индустриального программирования  
**Кафедра:** Кафедра индустриального программирования  
**Преподаватель:** Макиевский Станислав Евгеньевич  
**Семестр:** 3 семестр, 2026-2027 гг.

---

## Краткое описание результата

Версия Vue-приложения на **Composition API + `<script setup>`**, функционально эквивалентная типичной работе 12 (список элементов с фильтрацией).  

Повторно используемая логика (загрузка, фильтрация, состояния loading/error/empty) вынесена в composable **`useItems`**.

### Используемые технологии

- Vue 3.5+
- Vite 6
- Composition API (`ref`, `computed`, `onMounted`)
- `<script setup>`
- Composables
- Fetch API для загрузки dataset

---

## Требования к окружению

- Node.js 18+ (рекомендуется 20+)
- npm 9+

---

## Инструкция запуска

```bash
# 1. Клонировать репозиторий
git clone <url-репозитория>
cd trpo-pr13-composition-api

# 2. Установить зависимости
npm install

# 3. Запустить dev-сервер
npm run dev
```

Приложение откроется по адресу: http://localhost:5173

### Production build

```bash
npm run build
npm run preview
```

---

## Структура проекта

```
trpo-pr13-composition-api/
├── public/
│   └── dataset/
│       ├── items.json          # основные данные
│       ├── edge_cases.json     # граничные случаи
│       └── migration_map.csv   # карта миграции
├── src/
│   ├── components/
│   │   ├── ItemCard.vue        # карточка элемента (props + emit)
│   │   └── ItemList.vue        # список карточек
│   ├── composables/
│   │   └── useItems.js         # composable: загрузка + фильтр + состояния
│   ├── App.vue                 # корневой компонент (script setup)
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## Dataset

| Файл | Назначение |
|------|------------|
| `items.json` | Основной список из 10 элементов (id, title, active) |
| `edge_cases.json` | Пустой список и элемент без поля `active` |
| `migration_map.csv` | Соответствие конструкций Options API → Composition API |

Данные реально загружаются через `fetch('/dataset/items.json')` в `useItems`.

---

## Сравнительная таблица Options API ↔ Composition API

| № | Options API | Composition API (в этом проекте) |
|---|-------------|----------------------------------|
| 1 | `data() { return { items: [], filter: 'all' } }` | `const items = ref([])`<br>`const filter = ref('all')` |
| 2 | `computed: { visibleItems() { ... } }` | `const visibleItems = computed(() => ...)` |
| 3 | `methods: { loadItems() { ... } }` | `async function loadItems() { ... }` |
| 4 | `mounted() { this.loadItems() }` | `onMounted(() => { loadItems() })` |
| 5 | `props: { items: Array }` / `$emit` | `defineProps({ items: Array })`<br>`defineEmits(['select'])` |

---

## Зачем нужны composables

В Composition API логика больше не привязана к опциям компонента.  

**Composable** (`useItems`) позволяет:

- сгруппировать связанное состояние и операции (загрузка + фильтр + loading/error);
- переиспользовать эту логику в разных компонентах без дублирования;
- тестировать логику отдельно от шаблона;
- не превращать `setup` в «свалку» всего кода приложения.

Механически переносить весь код в один большой `<script setup>` без выделения composable — плохая практика: теряется читаемость и повторное использование.

---

## Основные пользовательские сценарии

1. При загрузке страницы данные подтягиваются из `items.json`.
2. Фильтры «Все / Активные / Неактивные» мгновенно обновляют список (через `computed`).
3. Клик по карточке выбирает элемент.
4. Кнопки Edge-кейсов демонстрируют обработку пустого списка и отсутствующего поля `active`.
5. Состояния: loading, error, empty, success.

---

## Проверка edge_cases

- **empty_list** — отображается сообщение «Список пуст».
- **missing_optional** — элемент без `active` корректно нормализуется (`active === false`).

---

## Git и история

Рекомендуемые коммиты (пример):

1. `chore: init Vite + Vue 3 project`
2. `feat: add dataset and basic App structure`
3. `feat: implement useItems composable`
4. `feat: add ItemList / ItemCard with props and emits`
5. `docs: add README with comparison table and run instructions`

История должна показывать поэтапный переход, а не один финальный commit.

---

## Что показать при защите

- Чистый запуск по README (`npm install` → `npm run dev`)
- Использование конкретного файла из `dataset/`
- Маршрут данных: `fetch` → `items` → `visibleItems` → шаблон
- Обработку ошибочного / пустого состояния
- Историю Git и последний рабочий коммит

---

## Контрольные ответы (кратко)

1. **Входные данные** — `public/dataset/items.json` (и edge_cases).
2. **Преобразование** — `useItems` → `computed` `visibleItems` + нормализация в `loadItems`.
3. **Ошибочное состояние** — сетевая ошибка / пустой список / отсутствие `active`.
4. **При росте проекта** — разбить на страницы, вынести API-слой, добавить Pinia при необходимости.
5. **После клонирования** — `npm install && npm run dev`.
6. **Отличие Options / Composition** — Options группирует по типу опции, Composition — по функциональной задаче (логика рядом с состоянием).
7. **Реактивность** — изменение `.value` у `ref`/`computed` автоматически запускает повторный рендер зависимых частей шаблона.
