export const adjectives: string[] = [
  'happy',
  'bright',
  'swift',
  'clever',
  'gentle',
  'brave',
  'calm',
  'dark',
  'eager',
  'fair',
  'wise',
  'kind',
  'loud',
  'merry',
  'nice',
  'proud',
  'quick',
  'rare',
  'soft',
  'tall',
  'warm',
  'young',
  'wild',
  'bold',
  'cool',
  'deep',
  'pure',
  'rich',
  'safe',
  'sharp',
  'strong',
  'sweet',
  'tough',
  'vast',
  'vivid',
  'light',
  'quiet',
  'smart',
  'fresh',
  'grand',
  'clean',
  'clear',
  'great',
  'free',
  'broad',
  'keen',
  'real',
  'true',
  'full',
  'fine',
];

export const nouns: string[] = [
  'river',
  'mountain',
  'forest',
  'star',
  'ocean',
  'cloud',
  'desert',
  'garden',
  'island',
  'lake',
  'moon',
  'rain',
  'snow',
  'storm',
  'sun',
  'tree',
  'valley',
  'wind',
  'world',
  'bridge',
  'castle',
  'city',
  'door',
  'field',
  'fire',
  'flower',
  'harbor',
  'home',
  'light',
  'path',
  'road',
  'rock',
  'shore',
  'sky',
  'space',
  'spring',
  'stone',
  'stream',
  'summer',
  'tide',
  'tower',
  'trail',
  'wave',
  'wood',
  'dawn',
  'dusk',
  'echo',
  'frost',
  'mist',
  'shadow',
];

export const verbs: string[] = [
  'running',
  'dancing',
  'singing',
  'jumping',
  'flying',
  'dreaming',
  'glowing',
  'hoping',
  'laughing',
  'playing',
  'reading',
  'sailing',
  'thinking',
  'walking',
  'writing',
  'seeking',
  'growing',
  'flowing',
  'shining',
  'smiling',
  'breathing',
  'climbing',
  'creating',
  'drifting',
  'exploring',
  'floating',
  'listening',
  'moving',
  'painting',
  'rising',
  'speaking',
  'swimming',
  'teaching',
  'watching',
  'wondering',
  'building',
  'caring',
  'drinking',
  'eating',
  'feeling',
  'helping',
  'knowing',
  'learning',
  'making',
  'resting',
  'seeing',
  'sleeping',
  'standing',
  'trying',
  'working',
];

export const SESSION_SLUG_MAX_ATTEMPTS = 50;
export const SESSION_SLUG_COMBINATIONS = adjectives.length * nouns.length * verbs.length;

function getRandomElement<T>(array: T[], random: () => number): T {
  return array[Math.floor(random() * array.length)];
}

function normalizeSessionSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

function sanitizeFallbackSuffix(suffix: string): string {
  return (
    suffix
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 16) || 'duplicate'
  );
}

export function createSessionSlug(random: () => number = Math.random): string {
  const adj = getRandomElement(adjectives, random);
  const noun = getRandomElement(nouns, random);
  const verb = getRandomElement(verbs, random);
  return `${adj}-${noun}-${verb}`;
}

export function generateSessionSlug(
  existingSessionIds: Iterable<string>,
  fallbackSuffix: string,
  random: () => number = Math.random
): string {
  const existing = new Set(
    Array.from(existingSessionIds)
      .map(normalizeSessionSlug)
      .filter((slug) => slug.length > 0)
  );
  let slug = '';

  for (let attempts = 0; attempts < SESSION_SLUG_MAX_ATTEMPTS; attempts += 1) {
    slug = createSessionSlug(random);
    if (!existing.has(slug)) {
      return slug;
    }
  }

  return `${slug}-${sanitizeFallbackSuffix(fallbackSuffix)}`;
}
