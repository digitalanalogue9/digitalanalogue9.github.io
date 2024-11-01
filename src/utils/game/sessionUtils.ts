import { Session } from '@/types';
import { IDBPDatabase } from 'idb';

export const adjectives: string[] = [
  'happy', 'bright', 'swift', 'clever', 'gentle',
  'brave', 'calm', 'dark', 'eager', 'fair',
  'wise', 'kind', 'loud', 'merry', 'nice',
  'proud', 'quick', 'rare', 'soft', 'tall',
  'warm', 'young', 'wild', 'bold', 'cool',
  'deep', 'pure', 'rich', 'safe', 'sharp',
  'strong', 'sweet', 'tough', 'vast', 'vivid',
  'light', 'quiet', 'smart', 'fresh', 'grand',
  'clean', 'clear', 'great', 'free', 'broad',
  'keen', 'real', 'true', 'full', 'fine'
];

export const nouns: string[] = [
  'river', 'mountain', 'forest', 'star', 'ocean',
  'cloud', 'desert', 'garden', 'island', 'lake',
  'moon', 'rain', 'snow', 'storm', 'sun',
  'tree', 'valley', 'wind', 'world', 'bridge',
  'castle', 'city', 'door', 'field', 'fire',
  'flower', 'harbor', 'home', 'light', 'path',
  'road', 'rock', 'shore', 'sky', 'space',
  'spring', 'stone', 'stream', 'summer', 'tide',
  'tower', 'trail', 'wave', 'wood', 'dawn',
  'dusk', 'echo', 'frost', 'mist', 'shadow'
];

export const verbs: string[] = [
  'running', 'dancing', 'singing', 'jumping', 'flying',
  'dreaming', 'glowing', 'hoping', 'laughing', 'playing',
  'reading', 'sailing', 'thinking', 'walking', 'writing',
  'seeking', 'growing', 'flowing', 'shining', 'smiling',
  'breathing', 'climbing', 'creating', 'drifting', 'exploring',
  'floating', 'listening', 'moving', 'painting', 'rising',
  'speaking', 'swimming', 'teaching', 'watching', 'wondering',
  'building', 'caring', 'drinking', 'eating', 'feeling',
  'helping', 'knowing', 'learning', 'making', 'resting',
  'seeing', 'sleeping', 'standing', 'trying', 'working'
];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export async function generateSessionName(db: IDBPDatabase): Promise<string> {
  let isUnique = false;
  let sessionName = '';
  let attempts = 0;
  const maxAttempts = 50; // Prevent infinite loop

  while (!isUnique && attempts < maxAttempts) {
    const adj = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);
    const verb = getRandomElement(verbs);
    sessionName = `${adj}-${noun}-${verb}`;

    // Check if session exists in IndexedDB
    const existingSession = await db.get('sessions', sessionName);
    if (!existingSession) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    // If we couldn't generate a unique name after maxAttempts,
    // append a timestamp to ensure uniqueness
    sessionName = `${sessionName}-${Date.now()}`;
  }

  return sessionName;
}

export const getSessions = async (db: IDBPDatabase): Promise<Session[]> => {
  try {
    const sessions = await db.getAll('sessions');
    return sessions;
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    return [];
  }
};
