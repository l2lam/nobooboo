<template>
  <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
    
    <div v-if="!store.isPlaying" class="text-center space-y-4">
      <div v-if="store.winner">
         <h2 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">Game Over!</h2>
         <p class="text-3xl text-white mb-2">Winner: {{ getWinnerNode()?.name }} {{ getWinnerNode()?.character.emoji }}</p>
         <p class="text-2xl text-slate-300">Score: ${{ getWinnerNode()?.score }}</p>
      </div>
      <div v-else>
         <h2 class="text-3xl font-bold text-white">Not Started</h2>
      </div>
      
      <button @click="$router.push('/')" class="mt-8 px-8 py-4 bg-blue-600 rounded-full font-bold text-white hover:bg-blue-500 hover:scale-105 transition-all text-xl shadow-lg">
        Play Again
      </button>
    </div>

    <!-- Main Game Board Area -->
    <div v-else class="w-full max-w-7xl relative transition-all duration-500" :class="{ 'blur-sm scale-95': showBooboo || showQuestion }">
      <GameBoard :tiles="store.board" :activeIndex="store.activeIndex">
        <template #center>
          <CenterConsole 
            :currentPlayer="store.currentPlayer"
            :currentRound="store.currentRound"
            :totalRounds="store.totalRounds"
            :isSpinning="store.isSpinning"
            @stopAction="handleStop"
          />
        </template>
      </GameBoard>
    </div>

    <!-- Modals and Overlays -->
    <QuestionModal 
      :isOpen="showQuestion" 
      :question="activeQuestion"
      :value="currentTileValue"
      @answer="handleQuestionAnswer"
    />

    <BoobooOverlay 
      :isOpen="showBooboo" 
      :emoji="store.activeTile?.emoji"
      @dismiss="handleBoobooDismiss"
    />
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import GameBoard from '../components/GameBoard.vue';
import CenterConsole from '../components/CenterConsole.vue';
import QuestionModal from '../components/QuestionModal.vue';
import BoobooOverlay from '../components/BoobooOverlay.vue';
import { availableTopics } from '../data';
import type { QuestionTemplate } from '../types';
import { useAudio } from '../composables/useAudio';

const store = useGameStore();
const router = useRouter();
const audio = useAudio();

let spinInterval: ReturnType<typeof setInterval> | null = null;
const spinDelay = ref(100);

// UI State
const showBooboo = ref(false);
const showQuestion = ref(false);
const activeQuestion = ref<QuestionTemplate | null>(null);
const currentTileValue = ref(0);

onMounted(() => {
  if (!store.isPlaying && !store.winner) {
    router.push('/');
    return;
  }
  if (store.isPlaying) {
    startSpinning();
  }
});

onUnmounted(() => {
  stopSpinLoop();
});

function getWinnerNode() {
  return store.players.find(p => p.id === store.winner);
}

function stopSpinLoop() {
  if (spinInterval) {
    clearInterval(spinInterval);
    spinInterval = null;
  }
}

function startSpinning() {
  stopSpinLoop();
  store.startSpin();
  spinDelay.value = store.spinSpeed;
  
  spinInterval = setInterval(() => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * store.board.length);
    } while (nextIdx === store.activeIndex && store.board.length > 1);
    store.setActiveIndex(nextIdx);
  }, spinDelay.value);
}

// Watch for spin index changes to play tick
watch(() => store.activeIndex, (newVal, oldVal) => {
  if (store.isSpinning && newVal !== oldVal) {
    audio.playTick();
  }
});

function handleStop() {
  audio.playStop();
  store.stopSpin();
  stopSpinLoop();
  
  const tile = store.activeTile;
  if (!tile) return;
  
  if (tile.type === 'booboo') {
    setTimeout(() => {
      audio.playFail();
      showBooboo.value = true;
      store.applyBooboo();
    }, 500);
  } else if (tile.type === 'reward') {
    setTimeout(() => {
      currentTileValue.value = tile.value || 0;
      activeQuestion.value = getRandomQuestionForPlayer();
      showQuestion.value = true;
    }, 500);
  } else if (tile.type === 'special') {
    setTimeout(() => {
      handleSpecialItem(tile.action);
      finishTurn();
    }, 500);
  }
}

function handleSpecialItem(action: string | undefined) {
  const p = store.currentPlayer;
  if (!p || !action) return;

  if (action === 'pass') {
     console.log("Passed turn");
  } else if (action === 'steal') {
     // implementation of steal: steal 100 points from someone
     const others = store.players.filter(x => x.id !== p.id && x.score > 0);
     if (others.length > 0) {
       const target = others[Math.floor(Math.random() * others.length)];
       const amt = Math.min(100, target.score);
       target.score -= amt;
       p.score += amt;
       alert(`Stole ${amt} points from ${target.name}!`);
     } else {
       alert("No one to steal points from.");
     }
  } else if (action === 'swap') {
     const others = store.players.filter(x => x.id !== p.id);
     if (others.length > 0) {
       const target = others[Math.floor(Math.random() * others.length)];
       const temp = p.score;
       p.score = target.score;
       target.score = temp;
       alert(`Swapped scores with ${target.name}!`);
     } else {
       alert("No one to swap scores with.");
     }
  }
}

function getRandomQuestionForPlayer(): QuestionTemplate | null {
  const player = store.currentPlayer;
  if (!player) return null;
  
  // Find topics for player
  const pTopicsStr = player.topics;
  const matchTopics = availableTopics.filter(t => pTopicsStr.includes(t.id));
  if (matchTopics.length === 0) return null;
  
  // Pick random topic
  const targetTopic = matchTopics[Math.floor(Math.random() * matchTopics.length)];
  if (!targetTopic.questions || targetTopic.questions.length === 0) return null;

  // Pick random question
  return targetTopic.questions[Math.floor(Math.random() * targetTopic.questions.length)];
}

function handleQuestionAnswer(isCorrect: boolean) {
  showQuestion.value = false;
  activeQuestion.value = null;
  
  if (isCorrect) {
    audio.playSuccess();
    store.addPoints(currentTileValue.value);
  } else {
    audio.playFail();
  }
  
  finishTurn();
}

function handleBoobooDismiss() {
  showBooboo.value = false;
  finishTurn();
}

function finishTurn() {
  store.nextTurn();
  if (store.isPlaying) {
    setTimeout(() => {
      startSpinning();
    }, 1000);
  }
}
</script>
