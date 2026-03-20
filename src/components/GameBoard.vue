<template>
  <div class="flex items-center justify-center w-full h-full">
    <div 
      class="relative grid gap-1 sm:gap-1.5"
      :style="{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        aspectRatio: `${cols} / ${rows}`,
        height: '100%',
        maxWidth: '96vw',
      }"
    >
      <!-- Center Console (spans internal rows/cols) -->
      <div 
        class="bg-slate-800 rounded-lg sm:rounded-xl border-2 sm:border-4 border-slate-700 flex items-center justify-center z-10 overflow-hidden"
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
        class="relative flex flex-col items-center justify-center p-0 rounded-md sm:rounded-lg md:rounded-xl border-2 sm:border-4 transition-all duration-300 overflow-hidden"
        :class="getTileClasses(tile, idx)"
      >
        <!-- Tile Content based on type -->
        <template v-if="tile.type === 'reward'">
          <span class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none mb-1 drop-shadow-sm">{{ tile.emoji }}</span>
          <span class="text-[0.5rem] sm:text-[0.7rem] md:text-xs lg:text-base font-black text-white drop-shadow-md leading-none">{{ tile.value }}</span>
        </template>
        <template v-else-if="tile.type === 'booboo'">
          <span class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-none transition-transform duration-300 hover:scale-110">{{ tile.emoji || '👹' }}</span>
          <span class="hidden sm:block text-[0.35rem] md:text-[0.5rem] lg:text-[0.6rem] font-bold text-red-500 uppercase tracking-tighter mt-1 text-center leading-none">NO BOOBOOS!</span>
        </template>
        <template v-else>
          <span class="text-[0.35rem] sm:text-[0.5rem] md:text-[0.65rem] lg:text-sm font-bold text-yellow-300 uppercase text-center leading-tight">{{ tile.action }}</span>
        </template>

        <!-- Selector Highlight overlay -->
        <div v-if="idx === activeIndex" class="absolute inset-0 border-2 sm:border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] rounded pointer-events-none transition-all duration-75"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Tile } from '../types';

const props = defineProps<{
  tiles: Tile[];
  activeIndex: number;
}>();

// ─── Orientation detection ───────────────────────────────────────────────────
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

function onResize() {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
}

onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));

// The board always has 24 perimeter tiles: 2*(cols + rows) - 4 = 24 → cols + rows = 14.
// Portrait  (h > w): 5 cols × 9 rows  → 2*5 + 2*9 - 4 = 24 ✓
// Landscape (w ≥ h): 9 cols × 5 rows  → 2*9 + 2*5 - 4 = 24 ✓
const isPortrait = computed(() => windowHeight.value > windowWidth.value);
const cols = computed(() => isPortrait.value ? 5 : 9);
const rows = computed(() => isPortrait.value ? 9 : 5);

// ─── Tile positioning ────────────────────────────────────────────────────────
// Perimeter mapping (clockwise from top-left):
//   Segment 0 – top row:          idx 0 … cols-1
//   Segment 1 – right col (interior): idx cols … cols+(rows-3)
//   Segment 2 – bottom row:       idx cols+(rows-2) … 2*cols+(rows-2)-1
//   Segment 3 – left col (interior): idx 2*cols+(rows-2) … 2*cols+2*(rows-2)-1

function getTilePosition(idx: number) {
  const c = cols.value;
  const r = rows.value;

  // Segment boundary indices
  const rightStart  = c;
  const bottomStart = c + (r - 2);
  const leftStart   = 2 * c + (r - 2);

  let col = 1;
  let row = 1;

  if (idx < rightStart) {
    // Top row: left → right
    col = idx + 1;
    row = 1;
  } else if (idx < bottomStart) {
    // Right col interior: top → bottom
    col = c;
    row = (idx - rightStart) + 2;
  } else if (idx < leftStart) {
    // Bottom row: right → left
    col = c - (idx - bottomStart);
    row = r;
  } else {
    // Left col interior: bottom → top
    col = 1;
    row = (r - 1) - (idx - leftStart);
  }

  return { gridColumn: col, gridRow: row };
}

// ─── Tile styling ─────────────────────────────────────────────────────────────
function getTileClasses(tile: Tile, idx: number) {
  const isActive = idx === props.activeIndex;
  
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
