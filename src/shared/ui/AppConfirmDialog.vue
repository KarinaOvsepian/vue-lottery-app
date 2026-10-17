<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from './AppButton.vue'

defineProps<{
  visible: boolean
  title?: string
  message?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

function onCancel() {
  emit('update:visible', false)
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="title || 'Підтвердження дії'"
    :modal="true"
    :closable="false"
    @update:visible="$emit('update:visible', $event)"
  >
    <p>{{ message || 'Ви дійсно бажаєте виконати цю дію?' }}</p>
    <template #footer>
      <AppButton label="Скасувати" severity="secondary" @click="onCancel" />
      <AppButton label="Підтвердити" severity="danger" :loading="loading" @click="onConfirm" />
    </template>
  </Dialog>
</template>
