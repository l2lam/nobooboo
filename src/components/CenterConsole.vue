<template>
  <div class="h-full w-full flex flex-col items-center justify-center p-1 sm:p-4 text-center gap-2 sm:gap-4 overflow-hidden">
    <div v-if="currentPlayer" class="space-y-1 sm:space-y-2">
      <h2 class="text-sm sm:text-xl md:text-3xl border-b-2 sm:border-b-4 border-slate-700 pb-1 sm:pb-2 text-slate-300">
        Round <span class="text-white font-black">{{ currentRound }}</span> / {{ totalRounds }}
      </h2>
      <div class="flex items-center justify-center gap-1 sm:gap-3">
        <span class="text-xl sm:text-3xl md:text-5xl bg-slate-700 p-1 sm:p-3 rounded-full shadow-inner">{{ currentPlayer.character.emoji }}</span>
        <div class="text-left min-w-0">
          <div class="text-xs sm:text-lg md:text-2xl font-bold text-slate-100 truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{{ currentPlayer.name }}</div>
          <div class="text-xs sm:text-sm md:text-lg font-bold text-pink-500">${{ currentPlayer.score }}</div>
        </div>
      </div>
    </div>

    <div>
      <button 
        @click="$emit('stopAction')"
        :disabled="!isSpinning"
        class="rounded-full bg-gradient-to-br from-red-500 to-red-700 border-[3px] sm:border-[6px] md:border-8 border-red-900 shadow-[inset_0_-5px_10px_rgba(0,0,0,0.5),0_8px_15px_rgba(0,0,0,0.5)] active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.8)] active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
        :style="{ width: 'clamp(70px, 18vmin, 220px)', height: 'clamp(70px, 18vmin, 220px)' }"
      >
        <span 
          class="font-black tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          :style="{ fontSize: 'clamp(0.6rem, 3vmin, 2rem)' }"
        >STOP!</span>
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
