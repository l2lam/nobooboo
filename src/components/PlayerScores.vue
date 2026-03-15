<template>
  <div class="w-full flex flex-wrap justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-4 md:mb-6">
    <div 
      v-for="(player, index) in players" 
      :key="player.id"
      class="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-xl sm:rounded-2xl border-2 sm:border-4 transition-all duration-300"
      :class="[
        index === currentPlayerIndex 
          ? 'bg-slate-700 border-pink-500 scale-105 shadow-[0_0_10px_rgba(236,72,153,0.6)] z-10' 
          : 'bg-slate-800 border-slate-600 scale-100 opacity-80 hover:opacity-100'
      ]"
    >
      <div class="text-xl sm:text-3xl md:text-4xl filter drop-shadow-md">{{ player.character.emoji }}</div>
      <div class="flex flex-col min-w-0">
        <span class="text-xs sm:text-base md:text-lg font-bold text-white leading-tight truncate max-w-[60px] sm:max-w-[90px] md:max-w-none" :class="{ 'text-pink-100': index === currentPlayerIndex }">{{ player.name }}</span>
        <span class="text-sm sm:text-lg md:text-2xl font-black text-pink-400 leading-tight transition-all duration-500">
          ${{ player.score }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerState } from '../types';

defineProps<{
  players: PlayerState[];
  currentPlayerIndex: number;
}>();
</script>
