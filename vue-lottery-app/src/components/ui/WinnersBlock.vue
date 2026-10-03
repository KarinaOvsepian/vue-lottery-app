<script setup lang="ts">
import { computed } from 'vue';
import type { Participant } from '@/types/lottery';
import WinnerTag from './WinnerTag.vue';
import AppButton from '@/components/ui/AppButton.vue';

const props = defineProps<{
  winners: Participant[];
  participants: Participant[];
}>();

const emit = defineEmits<{
  (e: 'pick-winner'): void;
  (e: 'remove-winner', id: string): void;
}>();

const isNewWinnerDisabled = computed(() => {
  const isLimitReached = props.winners.length >= 3;
  const isParticipantsEmpty = props.participants.length === 0;
  const areAllParticipantsWinners = props.winners.length >= props.participants.length;

  return isLimitReached || isParticipantsEmpty || areAllParticipantsWinners;
});
</script>

<template>
  <div class="winners-container">
    <div class="winners-list">
      <template v-if="winners.length > 0">
        <WinnerTag
          v-for="winner in winners"
          :key="winner.id"
          :winner="winner"
          @remove="emit('remove-winner', $event)"
        />
      </template>
      <span class="winners-title">Winners</span>
    </div>

    <AppButton
      type="button"
      :disabled="isNewWinnerDisabled"
      @click="emit('pick-winner')"
    >
      New winner
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
.winners-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.winners-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.winners-title {
  color: #9e9e9e;
  font-size: 14px;
  margin-left: 4px;
}
</style>
