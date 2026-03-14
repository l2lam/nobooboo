<template>
  <div class="flex flex-col items-center p-4">
    <div 
      class="relative grid gap-2"
      :style="{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }"
    >
      <!-- Center Console (spans internal rows/cols) -->
      <div 
        class="bg-slate-800 rounded-xl border-4 border-slate-700 flex items-center justify-center p-8 z-10"
        :style="{
          gridColumn: `2 / span ${cols - 2}`,
          gridRow: `2 / span ${rows - 2}`
        }"
      >
        <slot name="center" />
      </div>

      <!-- Perimeter Tiles -->
      <div 
        v-for="(tile, idx) in tiles" 
        :key="tile.id"
        :style="getTilePosition(idx)"
        class="relative flex flex-col items-center justify-center p-4 rounded-xl border-4 transition-all duration-300"
        :class="getTileClasses(tile, idx)"
      >
        <!-- Tile Content based on type -->
        <template v-if="tile.type === 'reward'">
          <span class="text-2xl font-black text-white drop-shadow-md">{{ tile.value }}</span>
        </template>
        <template v-else-if="tile.type === 'booboo'">
          <span class="text-3xl">{{ tile.emoji || '👹' }}</span>
          <span class="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">NO BOOBOOS!</span>
        </template>
        <template v-else>
          <span class="text-lg font-bold text-yellow-300 uppercase">{{ tile.action }}</span>
        </template>

        <!-- Selector Highlight overlay -->
        <div v-if="idx === activeIndex" class="absolute inset-0 border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] rounded-lg pointer-events-none transition-all duration-75"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tile } from '../types';

const props = defineProps<{
  tiles: Tile[];
  activeIndex: number;
}>();

// We map linear index around a 7x7 grid perimeter.
// Perimeter tiles = 7 + 7 + 5 + 5 = 24
const cols = 7;
const rows = 7;

function getTilePosition(idx: number) {
  // map 0..23 around the edges
  // 0-6: Top row (left to right)
  // 7-11: Right col (top to bottom)
  // 12-18: Bottom row (right to left)
  // 19-23: Left col (bottom to top)
  let c = 1;
  let r = 1;

  if (idx < 7) {
    c = idx + 1;
    r = 1;
  } else if (idx < 12) {
    c = 7;
    r = (idx - 6) + 1;
  } else if (idx < 19) {
    c = 7 - (idx - 12);
    r = 7;
  } else {
    c = 1;
    r = 7 - (idx - 18);
  }

  return {
    gridColumn: c,
    gridRow: r,
  };
}

function getTileClasses(tile: Tile, idx: number) {
  const isActive = idx === props.activeIndex;
  
  // Base background depending on tile type
  let bg = 'bg-slate-700 border-slate-600';
  if (tile.type === 'reward') {
    bg = 'bg-gradient-to-br from-blue-600 to-indigo-600 border-indigo-400';
  } else if (tile.type === 'booboo') {
    bg = 'bg-gradient-to-br from-red-600 to-orange-600 border-red-400';
  } else {
    bg = 'bg-gradient-to-br from-amber-500 to-yellow-600 border-yellow-400';
  }

  return [
    bg,
    isActive ? 'scale-110 z-20 shadow-2xl brightness-125' : 'scale-100 opacity-90'
  ];
}
</script>
