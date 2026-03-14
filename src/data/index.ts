import type { Topic } from '../types';

import grade1Math from './topics/grade-1-math.json';
import grade9Math from './topics/grade-9-math.json';
import grade9Science from './topics/grade-9-science.json';
import grade10Math from './topics/grade-10-math.json';
import grade10Science from './topics/grade-10-science.json';
import grade12Data from './topics/grade-12-data.json';

export const availableTopics = [
  grade1Math,
  grade9Math,
  grade9Science,
  grade10Math,
  grade10Science,
  grade12Data
] as unknown as Topic[];

// Avatars for players
export const AVATARS = [
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'dog', name: 'Dog', emoji: '🐶' },
  { id: 'fox', name: 'Fox', emoji: '🦊' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'koala', name: 'Koala', emoji: '🐨' },
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'tiger', name: 'Tiger', emoji: '🐯' },
  { id: 'frog', name: 'Frog', emoji: '🐸' },
];
