<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  label?: string
  loading?: boolean
  disabled?: boolean
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
  type?: 'button' | 'submit' | 'reset'
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    :label="label"
    :loading="loading"
    :disabled="disabled"
    :severity="severity"
    :type="type || 'button'"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>
