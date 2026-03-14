<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="bg-slate-800 rounded-3xl p-8 max-w-3xl w-full shadow-2xl border-4 border-slate-700 relative overflow-hidden">
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <h2 class="text-3xl font-bold text-slate-100">For ${{ value }}</h2>
        <div class="text-4xl font-mono px-6 py-2 rounded-full" :class="timerColor">
          {{ timeLeft }}s
        </div>
      </div>

      <!-- Question Content -->
      <div v-if="question" class="space-y-8">
        <p class="text-2xl text-slate-200 leading-relaxed font-medium">
          {{ parsedQuestionText }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            v-for="(opt, idx) in parsedOptions" 
            :key="idx"
            @click="selectOption(idx)"
            :disabled="hasAnswered"
            class="p-6 text-xl rounded-xl border-2 text-left transition-all"
            :class="getOptionClasses(idx)"
          >
            {{ opt }}
          </button>
        </div>
      </div>
      
      <!-- Result Overlay -->
      <div v-if="hasAnswered" class="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10 transition-all duration-300 pointer-events-none">
        <div class="text-center transform scale-150 animate-bounce">
          <div v-if="isCorrect" class="text-6xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
            CORRECT!
          </div>
          <div v-else class="text-6xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            WRONG!
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import type { Question } from '../types';

const props = defineProps<{
  isOpen: boolean;
  question: Question | null;
  value: number;
}>();

const emit = defineEmits<{
  (e: 'answer', isCorrect: boolean): void;
}>();

const TIME_LIMIT = 20;
const timeLeft = ref(TIME_LIMIT);
const hasAnswered = ref(false);
const selectedIndex = ref<number | null>(null);
const isCorrect = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const parsedQuestionText = ref('');
const parsedOptions = ref<string[]>([]);
let actualCorrectIndex = ref(-1);

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.question) {
    setupQuestion(props.question);
    startTimer();
  } else {
    stopTimer();
    hasAnswered.value = false;
    selectedIndex.value = null;
  }
});

onUnmounted(() => {
  stopTimer();
});

const timerColor = computed(() => {
  if (timeLeft.value > 10) return 'text-green-400 bg-green-400/10 font-bold';
  if (timeLeft.value > 5) return 'text-yellow-400 bg-yellow-400/10 font-bold';
  return 'text-red-500 bg-red-500/10 font-black animate-pulse';
});

function setupQuestion(q: Question) {
  parsedQuestionText.value = q.text;
  
  // Parse options and shuffle them
  const rawOptions = [...q.options];
  
  // simple shuffle mapping
  const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  parsedOptions.value = indices.map(i => rawOptions[i]);
  actualCorrectIndex.value = indices.indexOf(q.correctIndex);
}

function startTimer() {
  timeLeft.value = TIME_LIMIT;
  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}

function handleTimeout() {
  if (hasAnswered.value) return;
  finishAnswering(false, null);
}

function selectOption(idx: number) {
  if (hasAnswered.value) return;
  stopTimer();
  finishAnswering(idx === actualCorrectIndex.value, idx);
}

function finishAnswering(correct: boolean, selIdx: number | null) {
  hasAnswered.value = true;
  isCorrect.value = correct;
  selectedIndex.value = selIdx;
  
  setTimeout(() => {
    emit('answer', correct);
  }, 2000);
}

function getOptionClasses(idx: number) {
  if (!hasAnswered.value) {
    return 'border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:border-blue-400';
  }
  
  if (idx === actualCorrectIndex.value) {
    return 'border-green-500 bg-green-500/20 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.3)] z-10';
  }
  
  if (idx === selectedIndex.value && idx !== actualCorrectIndex.value) {
    return 'border-red-500 bg-red-500/20 text-red-300';
  }
  
  return 'border-slate-700 bg-slate-800 text-slate-500 opacity-50';
}
</script>
