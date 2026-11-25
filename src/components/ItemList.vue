<script setup>
import ItemCard from './ItemCard.vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

function onSelect(item) {
  emit('select', item)
}
</script>

<template>
  <div class="grid">
    <ItemCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @select="onSelect"
    />
  </div>
</template>
