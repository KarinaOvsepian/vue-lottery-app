<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps<{
  value: any[]
  columns?: { field: string; header: string }[]
  loading?: boolean
}>()
</script>

<template>
  <DataTable :value="value" :loading="loading" responsiveLayout="scroll">
    <template v-if="columns">
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      />
    </template>
    <slot />
  </DataTable>
</template>
