<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-xl overflow-hidden">
    <!-- Flashing background effects -->
    <div class="absolute inset-0 animate-pulse bg-red-600/30 mix-blend-overlay pointer-events-none"></div>
    <div class="absolute inset-0 animate-ping bg-red-500/5 mix-blend-screen pointer-events-none" style="animation-duration: 3s;"></div>

    <div class="relative z-10 text-center flex flex-col items-center">
      <!-- Big Taunting Booboo -->
      <div 
        class="animate-bounce-heavy filter drop-shadow-[0_0_50px_rgba(239,68,68,1)] transform transition-transform"
        :style="{ fontSize: 'clamp(5rem, 30vmin, 15rem)' }"
      >
        {{ emoji }}
      </div>
      
      <div class="flex flex-col items-center gap-2 -mt-4">
        <h1 class="text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-orange-500 to-red-700 uppercase tracking-tighter drop-shadow-2xl font-mono animate-shake">
          {{ currentTaunt }}
        </h1>
        
        <!-- Score Wipeout Section -->
        <div v-if="startScore > 0" class="flex flex-col items-center mt-4 sm:mt-8 p-6 sm:p-10 bg-black/40 rounded-3xl border-4 border-red-500/50 shadow-2xl backdrop-blur-sm animate-shake-little">
            <span class="text-red-400 text-sm sm:text-xl font-black uppercase tracking-widest mb-2 opacity-70">Wiping your points...</span>
            <span 
              class="text-6xl sm:text-8xl md:text-9xl font-black tabular-nums transition-all duration-75"
              :class="displayedScore > 0 ? 'text-red-500 scale-110' : 'text-slate-600 scale-90'"
            >
              ${{ Math.floor(displayedScore) }}
            </span>
        </div>
        
        <div v-else class="mt-4 sm:mt-8 flex flex-col items-center">
          <p class="text-xl sm:text-3xl font-bold text-red-200 bg-red-900/50 px-6 sm:px-12 py-3 sm:py-6 rounded-full border-2 border-red-500/30 shadow-lg">
            Zero points to take! Lucky you!
          </p>
        </div>
      </div>

      <button 
        @click="$emit('dismiss')"
        :disabled="isWiping"
        class="mt-8 sm:mt-16 px-10 sm:px-16 py-4 sm:py-6 bg-red-600 hover:bg-red-500 text-white font-black text-2xl sm:text-4xl rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.8)] hover:shadow-[0_0_50px_rgba(220,38,38,1)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
      >
        <span class="group-hover:animate-ping inline-block">DARN IT!</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  emoji?: string;
  startScore?: number;
}>(), {
  emoji: '👹',
  startScore: 0
});

const emit = defineEmits<{
  (e: 'dismiss'): void;
}>();

const displayedScore = ref(0);
const isWiping = ref(false);
const taunts = ['BOOBOO!', 'SO SAD!', 'POOF!', 'GONE!', 'BYE BYE!', 'NAH NAH NAH!', 'LOOOSER!'];
const currentTaunt = ref(taunts[0]);
let tauntInterval: any = null;
let wipeInterval: any = null;

onMounted(() => {
  if (props.isOpen) {
    startWipeout();
  }
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    startWipeout();
  } else {
    resetWipeout();
  }
});

onUnmounted(() => {
  resetWipeout();
});

function startWipeout() {
  displayedScore.value = props.startScore || 0;
  isWiping.value = displayedScore.value > 0;
  
  // Cycle taunts
  tauntInterval = setInterval(() => {
    currentTaunt.value = taunts[Math.floor(Math.random() * taunts.length)];
  }, 400);

  if (displayedScore.value > 0) {
    const duration = 2000; // 2 seconds
    const fps = 30;
    const steps = duration / (1000 / fps);
    const decrement = props.startScore / steps;
    
    wipeInterval = setInterval(() => {
      displayedScore.value = Math.max(0, displayedScore.value - decrement);
      if (displayedScore.value <= 0) {
        clearInterval(wipeInterval);
        isWiping.value = false;
        currentTaunt.value = "GOT'EM!";
        clearInterval(tauntInterval);
      }
    }, 1000 / fps);
  } else {
    isWiping.value = false;
  }
}

function resetWipeout() {
  if (tauntInterval) clearInterval(tauntInterval);
  if (wipeInterval) clearInterval(wipeInterval);
  tauntInterval = null;
  wipeInterval = null;
  isWiping.value = false;
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, -5px) rotate(2deg); }
  50% { transform: translate(-5px, 5px) rotate(-2deg); }
  75% { transform: translate(5px, 5px) rotate(1deg); }
}

@keyframes shake-little {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(2px, -2px); }
  50% { transform: translate(-2px, 2px); }
  75% { transform: translate(2px, 2px); }
}

@keyframes bounce-heavy {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.1); }
}

.animate-shake {
  animation: shake 0.2s infinite;
}

.animate-shake-little {
  animation: shake-little 0.15s infinite;
}

.animate-bounce-heavy {
  animation: bounce-heavy 0.6s infinite ease-in-out;
}
</style>
