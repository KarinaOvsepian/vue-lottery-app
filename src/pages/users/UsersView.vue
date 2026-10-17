<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import Column from 'primevue/column'
import { useUsersStore, type User } from '@/entities/user'
import { AppButton, AppInput, AppTable, AppConfirmDialog } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const usersStore = useUsersStore()

const { users, total, isLoading } = storeToRefs(usersStore)

const limit = 10
const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')
const isConfirmOpen = ref(false)
const selectedUser = ref<User | null>(null)

const WINNERS_KEY = 'lottery_winners'
const winners = ref<User[]>(JSON.parse(localStorage.getItem(WINNERS_KEY) || '[]'))

watch(winners, (val) => localStorage.setItem(WINNERS_KEY, JSON.stringify(val)), { deep: true })

function handlePickWinner() {
  const candidates = users.value.filter((u) => !winners.value.some((w) => w.id === u.id))
  if (candidates.length > 0 && winners.value.length < 3) {
    const winner = candidates[Math.floor(Math.random() * candidates.length)]
    if (winner) winners.value.push(winner)
  }
}

function handleRemoveWinner(id: number) {
  winners.value = winners.value.filter((w) => w.id !== id)
}

function updateUrl(page: number, q: string) {
  router.push({ query: { page: page > 1 ? page : undefined, q: q || undefined } })
}

watch(
  () => route.query,
  async (q) => {
    currentPage.value = Number(q.page) || 1
    searchQuery.value = (q.q as string) || ''
    const skip = (currentPage.value - 1) * limit
    await usersStore.fetchUsers(limit, skip, searchQuery.value)
  },
  { immediate: true, deep: true }
)

function openDeleteModal(user: User) {
  selectedUser.value = user
  isConfirmOpen.value = true
}

async function confirmDelete() {
  if (selectedUser.value) {
    try {
      await usersStore.removeUser(selectedUser.value.id)
      handleRemoveWinner(selectedUser.value.id)
      toast.add({ severity: 'info', summary: 'Видалено', detail: 'Користувача видалено', life: 3000 })
    } catch {
      toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося видалити', life: 3000 })
    }
  }
  isConfirmOpen.value = false
}
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <h2>Користувачі</h2>
      <router-link to="/users/create">
        <AppButton label="Додати користувача" severity="success" />
      </router-link>
    </div>

    <WinnersBlock
      :winners="winners"
      :participants="users"
      @pick-winner="handlePickWinner"
      @remove-winner="handleRemoveWinner"
    />

    <div class="toolbar">
      <AppInput v-model="searchQuery" placeholder="Пошук..." @update:model-value="updateUrl(1, $event)" />
    </div>

    <AppTable :value="users" :loading="isLoading">
      <Column field="id" header="ID" />
      <Column field="firstName" header="Ім'я" />
      <Column field="lastName" header="Прізвище" />
      <Column field="email" header="Email" />
      <Column field="phone" header="Телефон" />
      <Column header="Дії">
        <template #body="{ data }">
          <router-link :to="`/users/${data.id}`">
            <AppButton label="Деталі" severity="secondary" />
          </router-link>
          <AppButton label="Видалити" severity="danger" @click="openDeleteModal(data)" />
        </template>
      </Column>
    </AppTable>

    <AppConfirmDialog
      v-model:visible="isConfirmOpen"
      title="Видалення"
      :message="`Видалити користувача ${selectedUser?.firstName}?`"
      @confirm="confirmDelete"
    />
  </div>
</template>
