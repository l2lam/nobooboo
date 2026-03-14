<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md overflow-hidden">
    <!-- Flashing background effect -->
    <div class="absolute inset-0 animate-pulse bg-red-600/20 mix-blend-overlay pointer-events-none"></div>

    <div class="relative z-10 text-center flex flex-col items-center">
      <!-- Big Taunting Booboo -->
      <div class="text-[12rem] animate-bounce filter drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
        👹
      </div>
      
      <h1 class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 uppercase tracking-widest mt-8 drop-shadow-2xl font-mono">
        BOOBOO!
      </h1>
      
      <p class="mt-4 text-3xl font-bold text-red-200 bg-red-900/50 px-8 py-4 rounded-full border-2 border-red-500/30">
        Say goodbye to your points!
      </p>

      <button 
        @click="$emit('dismiss')"
        class="mt-12 px-12 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-2xl rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] hover:scale-105 transition-all"
      >
        DARN IT!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'dismiss'): void;
}>();
</script>
