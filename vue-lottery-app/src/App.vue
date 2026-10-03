<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { Participant, ParticipantFormData, SortField, SortOrder, FormErrors } from '@/types/lottery';

import WinnersBlock from '@/components/ui/WinnersBlock.vue';
import RegisterForm from '@/components/ui/RegisterBlock.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import ParticipantsTable from '@/components/ui/ParticipantsTable.vue';
import AppModal from '@/components/ui/AppModal.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppInput from '@/components/ui/AppInput.vue';

const STORAGE_KEY = 'lottery_participants';

const loadParticipants = (): Participant[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

const participants = ref<Participant[]>(loadParticipants());
const winners = ref<Participant[]>([]);

watch(
  participants,
  (newParticipants) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newParticipants));
  },
  { deep: true }
);

const handlePickWinner = () => {
  const availableCandidates = participants.value.filter(
    (p) => !winners.value.some((w) => w.id === p.id)
  );

  if (availableCandidates.length > 0 && winners.value.length < 3) {
    const randomIndex = Math.floor(Math.random() * availableCandidates.length);
    const selectedWinner = availableCandidates[randomIndex];

    if (selectedWinner) {
      winners.value.push(selectedWinner);
    }
  }
};

const handleRemoveWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};

const handleAddParticipant = (formData: ParticipantFormData) => {
  const newParticipant: Participant = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    ...formData
  };
  participants.value.push(newParticipant);
};

const searchQuery = ref('');
const sortField = ref<SortField>(null);
const sortOrder = ref<SortOrder>('asc');

const handleSearch = (query: string) => {
  searchQuery.value = query.toLowerCase();
};

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const displayedParticipants = computed(() => {
  let list = participants.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value)
  );

  if (sortField.value) {
    const field = sortField.value;
    const order = sortOrder.value === 'asc' ? 1 : -1;

    list = [...list].sort((a, b) => {
      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
      return 0;
    });
  }

  return list;
});

const isDeleteModalOpen = ref(false);
const participantToDelete = ref<Participant | null>(null);

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (participantToDelete.value) {
    const id = participantToDelete.value.id;
    participants.value = participants.value.filter((p) => p.id !== id);
    winners.value = winners.value.filter((w) => w.id !== id);
  }
  isDeleteModalOpen.value = false;
  participantToDelete.value = null;
};

const isEditModalOpen = ref(false);
const editingId = ref<string | null>(null);
const editForm = reactive<ParticipantFormData>({
  name: '',
  dateOfBirth: '',
  email: '',
  phone: ''
});
const editErrors = reactive<FormErrors>({});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

const openEditModal = (participant: Participant) => {
  editingId.value = participant.id;
  editForm.name = participant.name;
  editForm.dateOfBirth = participant.dateOfBirth;
  editForm.email = participant.email;
  editForm.phone = participant.phone;
  Object.keys(editErrors).forEach((key) => delete editErrors[key as keyof FormErrors]);
  isEditModalOpen.value = true;
};

const validateEditForm = (): boolean => {
  let valid = true;
  Object.keys(editErrors).forEach((key) => delete editErrors[key as keyof FormErrors]);

  if (!editForm.name.trim()) {
    editErrors.name = 'This value is required';
    valid = false;
  }

  if (!editForm.dateOfBirth) {
    editErrors.dateOfBirth = 'This value is required';
    valid = false;
  } else {
    const date = new Date(editForm.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      editErrors.dateOfBirth = 'Date of birth cannot be in the future';
      valid = false;
    }
  }

  if (!editForm.email.trim()) {
    editErrors.email = 'This value is required';
    valid = false;
  } else if (!emailRegex.test(editForm.email)) {
    editErrors.email = 'Please enter a valid email address';
    valid = false;
  } else {
    const exists = participants.value.some(
      (p) => p.id !== editingId.value && p.email.toLowerCase() === editForm.email.trim().toLowerCase()
    );
    if (exists) {
      editErrors.email = 'Participant with this email already exists';
      valid = false;
    }
  }

  if (!editForm.phone.trim()) {
    editErrors.phone = 'This value is required';
    valid = false;
  } else if (!phoneRegex.test(editForm.phone.trim())) {
    editErrors.phone = 'Format must be +380XXXXXXXXX';
    valid = false;
  }

  return valid;
};

const handleUpdateParticipant = () => {
  if (!validateEditForm() || !editingId.value) return;

  const targetIndex = participants.value.findIndex((p) => p.id === editingId.value);
  if (targetIndex !== -1) {
    const updated: Participant = {
      id: editingId.value,
      name: editForm.name.trim(),
      dateOfBirth: editForm.dateOfBirth,
      email: editForm.email.trim(),
      phone: editForm.phone.trim()
    };
    participants.value[targetIndex] = updated;

    const winnerIndex = winners.value.findIndex((w) => w.id === editingId.value);
    if (winnerIndex !== -1) {
      winners.value[winnerIndex] = updated;
    }
  }
  isEditModalOpen.value = false;
};
</script>

<template>
  <main class="app-layout">
    <div class="app-container">
      <WinnersBlock
        :winners="winners"
        :participants="participants"
        @pick-winner="handlePickWinner"
        @remove-winner="handleRemoveWinner"
      />

      <RegisterForm
        :existing-participants="participants"
        @submit-participant="handleAddParticipant"
      />

      <SearchBar @filter-by-name="handleSearch" />

      <ParticipantsTable
        :participants="displayedParticipants"
        :current-sort-field="sortField"
        :current-sort-order="sortOrder"
        @sort="handleSort"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <AppModal :is-open="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #header>Підтвердження видалення</template>
      <template #body>
        <p v-if="participantToDelete">
          Ви дійсно бажаєте видалити учасника
          <strong>{{ participantToDelete.name }}</strong>,
          <em>{{ participantToDelete.email }}</em>?
        </p>
      </template>
      <template #footer>
        <AppButton variant="secondary" @click="isDeleteModalOpen = false">Ні</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Так</AppButton>
      </template>
    </AppModal>

    <AppModal :is-open="isEditModalOpen" @close="isEditModalOpen = false">
      <template #header>Редагувати дані учасника</template>
      <template #body>
        <form @submit.prevent="handleUpdateParticipant">
          <label class="modal-label">Name</label>
          <AppInput v-model="editForm.name" :error="editErrors.name" />

          <label class="modal-label">Date of Birth</label>
          <AppInput v-model="editForm.dateOfBirth" type="date" :error="editErrors.dateOfBirth" />

          <label class="modal-label">Email</label>
          <AppInput v-model="editForm.email" type="email" :error="editErrors.email" />

          <label class="modal-label">Phone number</label>
          <AppInput v-model="editForm.phone" :error="editErrors.phone" />
        </form>
      </template>
      <template #footer>
        <AppButton variant="secondary" @click="isEditModalOpen = false">Скасувати</AppButton>
        <AppButton variant="primary" @click="handleUpdateParticipant">Оновити дані</AppButton>
      </template>
    </AppModal>
  </main>
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0f2f5;
  color: #333333;
}

.app-layout {
  min-height: 100vh;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 760px;
}

.modal-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
