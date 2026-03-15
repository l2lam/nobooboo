<template>
  <div class="min-h-screen flex flex-col items-center p-3 sm:p-6 md:p-8">
    <div class="w-full max-w-4xl bg-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-700">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-5 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Game Setup
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <!-- Main Form Settings -->
        <div class="space-y-5 sm:space-y-6">
          <div class="space-y-2">
            <label class="block text-slate-300 font-bold text-sm sm:text-base">Number of Rounds</label>
            <input type="number" min="1" max="10" v-model="rounds" class="w-full p-2.5 sm:p-3 bg-slate-900 rounded-lg border border-slate-600 focus:border-pink-500 focus:outline-none text-sm sm:text-base" />
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg sm:text-xl font-bold text-slate-200">Topics</h3>
              <button @click="handleEditTopic()" class="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors">
                + ADD CUSTOM TOPIC
              </button>
            </div>
            <div class="space-y-2 max-h-44 sm:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="cat in categories" :key="cat" class="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <div @click="toggleCategory(cat)" class="flex justify-between items-center p-2.5 sm:p-3 bg-slate-800 cursor-pointer hover:bg-slate-700 transition-colors">
                  <span class="font-bold text-slate-300 text-sm sm:text-base">{{ cat }}</span>
                  <span class="text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': collapsedCategories[cat] }">▼</span>
                </div>
                <div v-show="!collapsedCategories[cat]" class="divide-y divide-slate-700">
                  <div v-for="topic in getTopicsByCategory(cat)" :key="topic.id" class="flex items-center justify-between p-2.5 sm:p-3 hover:bg-slate-800/50 transition-colors">
                    <label class="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1 min-w-0">
                      <input type="checkbox" :value="topic.id" v-model="selectedTopics" class="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 rounded focus:ring-pink-500 bg-slate-800 border-slate-600 shrink-0">
                      <span class="text-slate-300 text-sm sm:text-base truncate" :title="topic.description">{{ topic.name }}</span>
                    </label>
                    <div class="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4 shrink-0">
                      <button v-if="!topic.isBuiltIn" @click.stop="handleEditTopic(topic.id, false)" class="text-xs px-1.5 sm:px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">EDIT</button>
                      <button v-else @click.stop="handleEditTopic(topic.id, true)" class="text-xs px-1.5 sm:px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded">CLONE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="selectedTopics.length === 0" class="text-sm text-red-400">Please select at least one topic.</p>
          </div>
        </div>

        <!-- Players -->
        <div class="space-y-3 sm:space-y-4">
          <h3 class="text-lg sm:text-xl font-bold text-slate-200 flex justify-between items-center">
            <span>Players</span>
            <span class="text-xs sm:text-sm font-normal text-slate-400">{{ players.length }} joined</span>
          </h3>
          
          <div class="flex space-x-2">
            <input @keyup.enter="addPlayer" v-model="newPlayerName" placeholder="Enter player name..." class="flex-1 p-2.5 sm:p-3 bg-slate-900 rounded-lg border border-slate-600 focus:border-pink-500 focus:outline-none placeholder-slate-500 text-sm sm:text-base" />
            <button @click="addPlayer" :disabled="!newPlayerName.trim()" class="px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-pink-500 transition-colors text-sm sm:text-base">
              Add
            </button>
          </div>

          <div class="space-y-2 mt-3 sm:mt-4 max-h-52 sm:max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="player in players" :key="player.id" class="flex items-center justify-between p-2.5 sm:p-3 bg-slate-900 rounded-lg border border-slate-700">
              <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <span class="text-2xl sm:text-3xl bg-slate-800 p-1.5 sm:p-2 rounded-lg shrink-0">{{ player.character.emoji }}</span>
                <span class="font-bold text-base sm:text-lg text-slate-300 truncate">{{ player.name }}</span>
              </div>
              <button @click="store.removePlayer(player.id)" class="text-slate-500 hover:text-red-500 p-1.5 sm:p-2 transition-colors shrink-0">
                ✕
              </button>
            </div>
            
            <div v-if="players.length === 0" class="text-center p-4 sm:p-6 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg text-sm sm:text-base">
              Add players to start!
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 sm:mt-12 flex justify-center">
        <button 
          @click="startGame" 
          :disabled="!canStart"
          class="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-lg sm:text-xl font-bold rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.8)] disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all w-full md:w-auto"
        >
          START GAME
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import { AVATARS } from '../data';
import ServiceFactory from '../services';
import type { Topic } from '../types';
import { CATEGORY } from '../constants';

const router = useRouter();
const store = useGameStore();

const rounds = ref(3);
const selectedTopics = ref<string[]>([]);
const newPlayerName = ref('');

const topics = ref<Topic[]>([]);
const categories = ref<string[]>([]);
const collapsedCategories = ref<Record<string, boolean>>({});

const PLAYERS_STORAGE_KEY = 'nobooboo_players';
const initialized = ref(false);

const ROUNDS_STORAGE_KEY = 'nobooboo_rounds';
const TOPICS_STORAGE_KEY = 'nobooboo_selected_topics';

onMounted(async () => {
  const dataService = ServiceFactory.getDataService();
  const allTopics = await dataService.getAllTopics();
  topics.value = allTopics;
  
  const cats = Array.from(new Set(allTopics.map(t => t.category || CATEGORY.CUSTOM)));
  categories.value = cats.sort();

  // 1. Restore Rounds
  const savedRounds = localStorage.getItem(ROUNDS_STORAGE_KEY);
  if (savedRounds) rounds.value = parseInt(savedRounds) || 3;

  // 2. Restore Topics
  const savedTopics = localStorage.getItem(TOPICS_STORAGE_KEY);
  if (savedTopics) {
    const savedIds: string[] = JSON.parse(savedTopics);
    selectedTopics.value = savedIds.filter(id => allTopics.some(t => t.id === id));
  } else {
    selectedTopics.value = [
      'grade-1-math', 'grade-9-math', 'grade-9-science',
      'grade-10-math', 'grade-10-science', 'grade-12-data'
    ].filter(id => allTopics.some(t => t.id === id));
  }

  // 3. Restore Players (now they get the correct selectedTopics)
  const savedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
  if (savedPlayers && store.players.length === 0) {
    try {
      const parsed: { name: string; character: import('../types').Character }[] = JSON.parse(savedPlayers);
      for (const p of parsed) {
        store.addPlayer(p.name, p.character, selectedTopics.value);
      }
    } catch { /* ignore corrupt data */ }
  }

  initialized.value = true;
});

watch(selectedTopics, (newVal) => {
  localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

watch(rounds, (newVal) => {
  localStorage.setItem(ROUNDS_STORAGE_KEY, newVal.toString());
});

// Persist players whenever the list changes, but only after initial restoration
watch(
  () => store.players.map(p => ({ name: p.name, character: p.character })),
  (toSave) => {
    if (!initialized.value) return;
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(toSave));
  },
  { deep: true }
);

function getTopicsByCategory(cat: string) {
  return topics.value.filter(t => (t.category || CATEGORY.CUSTOM) === cat);
}

function toggleCategory(cat: string) {
  collapsedCategories.value[cat] = !collapsedCategories.value[cat];
}

function handleEditTopic(topicId?: string, isClone?: boolean) {
  if (topicId) {
    router.push({ path: '/editor', query: { topicId, isClone: isClone ? 'true' : 'false' } });
  } else {
    router.push('/editor');
  }
}

const players = computed(() => store.players);

const canStart = computed(() => {
  return players.value.length >= 1 && selectedTopics.value.length > 0 && rounds.value > 0;
});

const usedAvatars = computed(() => new Set(players.value.map(p => p.character.id)));

function addPlayer() {
  const name = newPlayerName.value.trim();
  if (!name) return;

  const available = AVATARS.filter(a => !usedAvatars.value.has(a.id));
  const avatar = available.length > 0 
    ? available[Math.floor(Math.random() * available.length)]
    : AVATARS[Math.floor(Math.random() * AVATARS.length)];

  store.addPlayer(name, avatar, selectedTopics.value);
  newPlayerName.value = '';
}

function startGame() {
  store.setRounds(rounds.value);
  store.startGame();
  router.push('/game');
}
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e293b; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b; 
}
</style>
