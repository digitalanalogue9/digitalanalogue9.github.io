import { Session } from "@/types/Session";

export const adjectives: string[] = ['happy', 'bright', 'swift', 'clever', 'gentle'];
export const nouns: string[] = ['river', 'mountain', 'forest', 'star', 'ocean'];
export const verbs: string[] = ['running', 'dancing', 'singing', 'jumping', 'flying'];

export function generateSessionName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  return `${adj}-${noun}-${verb}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
export const getSessions = async (): Promise<Session[]> => {
    // Assuming you're using IndexedDB or localStorage to store sessions
    // Implementation will depend on your storage method
    try {
      // You might want to implement the actual storage retrieval logic here
      // This is just a placeholder implementation
      const sessions = localStorage.getItem('sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error retrieving sessions:', error);
      return [];
    }
  };