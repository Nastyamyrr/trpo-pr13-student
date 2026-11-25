<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

function onSelect() {
  emit('select', props.item)
}
</script>

<template>
  <div class="card" @click="onSelect">
    <b>{{ item.title }}</b>
    <span class="status" :class="item.active ? 'status-active' : 'status-inactive'">
      {{ item.active ? 'активен' : 'неактивен' }}
    </span>
  </div>
</template>
