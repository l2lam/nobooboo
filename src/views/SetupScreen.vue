<template>
  <div class="min-h-screen flex flex-col items-center p-8">
    <div class="w-full max-w-4xl bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
      <h1 class="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
        Game Setup
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Main Form Settings -->
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="block text-slate-300 font-bold">Number of Rounds</label>
            <input type="number" min="1" max="10" v-model="rounds" class="w-full p-3 bg-slate-900 rounded-lg border border-slate-600 focus:border-pink-500 focus:outline-none" />
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-slate-200">Topics</h3>
              <button @click="handleEditTopic()" class="text-sm px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors">
                + ADD CUSTOM TOPIC
              </button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="cat in categories" :key="cat" class="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <div @click="toggleCategory(cat)" class="flex justify-between items-center p-3 bg-slate-800 cursor-pointer hover:bg-slate-700 transition-colors">
                  <span class="font-bold text-slate-300">{{ cat }}</span>
                  <span class="text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': collapsedCategories[cat] }">▼</span>
                </div>
                <div v-show="!collapsedCategories[cat]" class="divide-y divide-slate-700">
                  <div v-for="topic in getTopicsByCategory(cat)" :key="topic.id" class="flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors">
                    <label class="flex items-center space-x-3 cursor-pointer flex-1">
                      <input type="checkbox" :value="topic.id" v-model="selectedTopics" class="w-5 h-5 text-pink-500 rounded focus:ring-pink-500 bg-slate-800 border-slate-600">
                      <span class="text-slate-300" :title="topic.description">{{ topic.name }}</span>
                    </label>
                    <div class="flex space-x-2 ml-4">
                      <button v-if="!topic.isBuiltIn" @click.stop="handleEditTopic(topic.id, false)" class="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">EDIT</button>
                      <button v-else @click.stop="handleEditTopic(topic.id, true)" class="text-xs px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded">CLONE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="selectedTopics.length === 0" class="text-sm text-red-400">Please select at least one topic.</p>
          </div>
        </div>

        <!-- Players -->
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-slate-200 flex justify-between items-center">
            <span>Players</span>
            <span class="text-sm font-normal text-slate-400">{{ players.length }} joined</span>
          </h3>
          
          <div class="flex space-x-2">
            <input @keyup.enter="addPlayer" v-model="newPlayerName" placeholder="Enter player name..." class="flex-1 p-3 bg-slate-900 rounded-lg border border-slate-600 focus:border-pink-500 focus:outline-none placeholder-slate-500" />
            <button @click="addPlayer" :disabled="!newPlayerName.trim()" class="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-pink-500 transition-colors">
              Add
            </button>
          </div>

          <div class="space-y-2 mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="player in players" :key="player.id" class="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700">
              <div class="flex items-center space-x-3">
                <span class="text-3xl bg-slate-800 p-2 rounded-lg">{{ player.character.emoji }}</span>
                <span class="font-bold text-lg text-slate-300">{{ player.name }}</span>
              </div>
              <button @click="store.removePlayer(player.id)" class="text-slate-500 hover:text-red-500 p-2 transition-colors">
                ✕
              </button>
            </div>
            
            <div v-if="players.length === 0" class="text-center p-6 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
              Add players to start!
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 flex justify-center">
        <button 
          @click="startGame" 
          :disabled="!canStart"
          class="px-12 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xl font-bold rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.8)] disabled:opacity-50 disabled:shadow-none hover:scale-105 transition-all w-full md:w-auto"
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

onMounted(async () => {
  const dataService = ServiceFactory.getDataService();
  const allTopics = await dataService.getAllTopics();
  topics.value = allTopics;
  
  const cats = Array.from(new Set(allTopics.map(t => t.category || CATEGORY.CUSTOM)));
  categories.value = cats.sort();

  const STORAGE_KEY = 'nobooboo_selected_topics';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const savedIds: string[] = JSON.parse(saved);
    // Only keep IDs that still exist in available topics
    selectedTopics.value = savedIds.filter(id => allTopics.some(t => t.id === id));
  } else {
    // Default: select all built-in topics
    selectedTopics.value = [
      'grade-1-math',
      'grade-9-math',
      'grade-9-science',
      'grade-10-math',
      'grade-10-science',
      'grade-12-data'
    ].filter(id => allTopics.some(t => t.id === id));
  }
});

watch(selectedTopics, (newVal) => {
  localStorage.setItem('nobooboo_selected_topics', JSON.stringify(newVal));
}, { deep: true });

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
