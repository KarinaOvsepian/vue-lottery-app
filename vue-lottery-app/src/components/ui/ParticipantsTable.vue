<script setup lang="ts">
import type { Participant, SortField, SortOrder } from '@/types/lottery';
import AppButton from '@/components/ui/AppButton.vue';

const props = defineProps<{
  participants: Participant[];
  currentSortField: SortField;
  currentSortOrder: SortOrder;
}>();

const emit = defineEmits<{
  (e: 'sort', field: SortField): void;
  (e: 'edit', participant: Participant): void;
  (e: 'delete', participant: Participant): void;
}>();

const getSortIcon = (field: SortField) => {
  if (props.currentSortField !== field) return '↕';
  return props.currentSortOrder === 'asc' ? '↑' : '↓';
};
</script>

<template>
  <div class="table-card">
    <table class="participants-table">
      <thead>
      <tr>
        <th class="col-num">#</th>
        <th class="sortable" @click="emit('sort', 'name')">
          Name <span class="sort-icon">{{ getSortIcon('name') }}</span>
        </th>
        <th class="sortable" @click="emit('sort', 'dateOfBirth')">
          Date of Birth <span class="sort-icon">{{ getSortIcon('dateOfBirth') }}</span>
        </th>
        <th>Email</th>
        <th>Phone number</th>
        <th class="actions-header">Дії</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="participants.length === 0">
        <td colspan="6" class="empty-cell">Список учасників порожній</td>
      </tr>
      <tr v-for="(participant, index) in participants" :key="participant.id">
        <td>{{ index + 1 }}</td>
        <td>{{ participant.name }}</td>
        <td>{{ participant.dateOfBirth }}</td>
        <td>{{ participant.email }}</td>
        <td>{{ participant.phone }}</td>
        <td class="action-buttons">
          <AppButton
            variant="secondary"
            @click="emit('edit', participant)"
          >
            Редагувати дані
          </AppButton>
          <AppButton
            variant="danger"
            @click="emit('delete', participant)"
          >
            Видалити учасника
          </AppButton>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-card {
  background-color: #ffffff;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.participants-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 12px 10px;
    text-align: left;
    border-bottom: 1px solid #eeeeee;
  }

  th {
    color: #424242;
    font-weight: 600;
  }

  .sortable {
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .sort-icon {
    font-size: 11px;
    margin-left: 4px;
    color: #757575;
  }

  .col-num {
    width: 40px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .actions-header {
    text-align: right;
  }

  .empty-cell {
    text-align: center;
    color: #9e9e9e;
    padding: 24px;
  }
}
</style>
