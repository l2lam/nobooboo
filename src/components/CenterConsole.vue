<template>
  <div class="h-full w-full flex flex-col items-center justify-center p-8 text-center space-y-8">
    <div v-if="currentPlayer" class="space-y-4">
      <h2 class="text-5xl border-b-4 border-slate-700 pb-4 text-slate-300">
        Round <span class="text-white font-black">{{ currentRound }}</span> / {{ totalRounds }}
      </h2>
      <div class="flex items-center justify-center space-x-4">
        <span class="text-6xl bg-slate-700 p-4 rounded-full shadow-inner">{{ currentPlayer.character.emoji }}</span>
        <div class="text-left">
          <div class="text-3xl font-bold text-slate-100">{{ currentPlayer.name }}</div>
          <div class="text-xl font-bold text-pink-500">${{ currentPlayer.score }}</div>
        </div>
      </div>
    </div>

    <div>
      <button 
        @click="$emit('stopAction')"
        :disabled="!isSpinning"
        class="w-64 h-64 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-8 border-red-900 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.5)] active:shadow-[inset_0_5px_15px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.5)] active:translate-y-2 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
      >
        <span class="text-5xl font-black tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">STOP!</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerState } from '../types';

defineProps<{
  currentPlayer: PlayerState | undefined;
  currentRound: number;
  totalRounds: number;
  isSpinning: boolean;
}>();

defineEmits<{
  (e: 'stopAction'): void;
}>();
</script>
