<template>
  <div class="w-full flex flex-wrap justify-center gap-4 mb-8">
    <div 
      v-for="(player, index) in players" 
      :key="player.id"
      class="flex items-center gap-3 px-6 py-3 rounded-2xl border-4 transition-all duration-300"
      :class="[
        index === currentPlayerIndex 
          ? 'bg-slate-700 border-pink-500 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.6)] z-10' 
          : 'bg-slate-800 border-slate-600 scale-100 opacity-80 hover:opacity-100'
      ]"
    >
      <div class="text-4xl filter drop-shadow-md">{{ player.character.emoji }}</div>
      <div class="flex flex-col">
        <span class="text-lg font-bold text-white leading-tight" :class="{ 'text-pink-100': index === currentPlayerIndex }">{{ player.name }}</span>
        <span class="text-2xl font-black text-pink-400 leading-tight transition-all duration-500">
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
