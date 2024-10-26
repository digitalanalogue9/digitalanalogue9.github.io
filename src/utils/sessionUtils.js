// Function to generate a random 3-word session name
const adjectives = ['happy', 'bright', 'swift', 'clever', 'gentle'];
const nouns = ['river', 'mountain', 'forest', 'star', 'ocean'];
const verbs = ['running', 'dancing', 'singing', 'jumping', 'flying'];

export function generateSessionName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  return `${adj}-${noun}-${verb}`;
}

export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
