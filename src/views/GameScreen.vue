<template>
  <div class="h-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
    
    <div v-if="!store.isPlaying" class="text-center space-y-4 p-4">
      <div v-if="store.winner">
         <h2 class="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">Game Over!</h2>
         <p class="text-xl sm:text-2xl md:text-3xl text-white mb-2">Winner: {{ getWinnerNode()?.name }} {{ getWinnerNode()?.character.emoji }}</p>
         <p class="text-lg sm:text-xl md:text-2xl text-slate-300">Score: ${{ getWinnerNode()?.score }}</p>
      </div>
      <div v-else>
         <h2 class="text-2xl sm:text-3xl font-bold text-white">Not Started</h2>
      </div>
      
      <button @click="$router.push('/')" class="mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 rounded-full font-bold text-white hover:bg-blue-500 hover:scale-105 transition-all text-lg sm:text-xl shadow-lg">
        Play Again
      </button>
    </div>

    <!-- Main Game Board Area -->
    <div
      v-else
      class="absolute inset-0 flex flex-col items-center px-1 sm:px-2 py-1 sm:py-2 transition-all duration-500"
      :class="{ 'blur-sm scale-95': showBooboo || showQuestion }"
    >
      <!-- Quit Button -->
      <button 
        v-if="store.isPlaying"
        @click="handleQuit" 
        class="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all flex items-center gap-2 group text-xs sm:text-sm"
      >
        <span class="group-hover:scale-110 transition-transform">X</span>
        Quit Game
      </button>

      <PlayerScores
        class="shrink-0"
        :players="store.players"
        :currentPlayerIndex="store.currentPlayerIndex"
      />
      <GameBoard
        class="flex-1 min-h-0 w-full"
        :tiles="store.board"
        :activeIndex="store.activeIndex"
      >
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
      :startScore="boobooStartScore"
      @dismiss="handleBoobooDismiss"
    />
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import GameBoard from '../components/GameBoard.vue';
import PlayerScores from '../components/PlayerScores.vue';
import CenterConsole from '../components/CenterConsole.vue';
import QuestionModal from '../components/QuestionModal.vue';
import BoobooOverlay from '../components/BoobooOverlay.vue';
import ServiceFactory from '../services';
import type { Question } from '../types';
import { useAudio } from '../composables/useAudio';

const store = useGameStore();
const router = useRouter();
const audio = useAudio();

let spinInterval: ReturnType<typeof setInterval> | null = null;
const spinDelay = ref(100);

// UI State
const showBooboo = ref(false);
const boobooStartScore = ref(0);
const showQuestion = ref(false);
const activeQuestion = ref<Question | null>(null);
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
    const preScore = store.currentPlayer?.score || 0;
    setTimeout(() => {
      audio.playBooboo();
      boobooStartScore.value = preScore;
      showBooboo.value = true;
      store.applyBooboo();
    }, 500);
  } else if (tile.type === 'reward') {
    setTimeout(async () => {
      currentTileValue.value = tile.value || 0;
      activeQuestion.value = await getRandomQuestionForPlayer();
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

async function getRandomQuestionForPlayer(): Promise<Question | null> {
  const player = store.currentPlayer;
  if (!player || player.topics.length === 0) return null;
  
  // Pick a random topic ID from the player's selected topics
  const targetTopicId = player.topics[Math.floor(Math.random() * player.topics.length)];
  
  const dataService = ServiceFactory.getDataService();
  const qList = await dataService.getQuestions(targetTopicId, 1);
  
  return qList.length > 0 ? qList[0] : null;
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

function handleQuit() {
  if (confirm('Are you sure you want to quit the current game?')) {
    stopSpinLoop();
    store.resetGame();
    router.push('/');
  }
}
</script>
