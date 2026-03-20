export const SCREEN_ID = {
    CONFIG: 'config',
    GAME: 'game',
    TOPICS_EDITOR: 'topics-editor',
} as const;

export type ScreenId = typeof SCREEN_ID[keyof typeof SCREEN_ID];

export const STORAGE_KEYS = {
    CUSTOM_TOPICS: 'mock_custom_topics',
    CUSTOM_QUESTIONS: 'mock_custom_questions',
} as const;

export const CATEGORY = {
    CUSTOM: 'Custom'
} as const;

export const REWARD_EMOJIS = [
    { emoji: '🍬', value: 100 },
    { emoji: '🍦', value: 200 },
    { emoji: '🍕', value: 300 },
    { emoji: '🍔', value: 500 },
    { emoji: '🎁', value: 750 },
    { emoji: '💰', value: 1000 },
    { emoji: '🏆', value: 1500 },
    { emoji: '💎', value: 2500 },
    { emoji: '🚗', value: 5000 },
];
