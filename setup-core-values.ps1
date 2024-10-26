# Create directories
New-Item -ItemType Directory -Force -Path "src/components"
New-Item -ItemType Directory -Force -Path "src/commands"
New-Item -ItemType Directory -Force -Path "src/data"
New-Item -ItemType Directory -Force -Path "src/db"
New-Item -ItemType Directory -Force -Path "src/store"

# Create component files
New-Item -ItemType File -Force -Path "src/components/Card.js"
New-Item -ItemType File -Force -Path "src/components/CategoryColumn.js"
New-Item -ItemType File -Force -Path "src/components/Instructions.js"
New-Item -ItemType File -Force -Path "src/components/RoundUI.js"
New-Item -ItemType File -Force -Path "src/components/StartScreen.js"

# Create command files
New-Item -ItemType File -Force -Path "src/commands/Command.js"
New-Item -ItemType File -Force -Path "src/commands/DropCommand.js"
New-Item -ItemType File -Force -Path "src/commands/MoveCommand.js"

# Create data file
New-Item -ItemType File -Force -Path "src/data/values.json"

# Create database file
New-Item -ItemType File -Force -Path "src/db/indexedDB.js"

# Create store file
New-Item -ItemType File -Force -Path "src/store/useGameStore.js"

# Create pages (if not already created by Next.js)
New-Item -ItemType File -Force -Path "src/pages/history.js"

# Function to write content to file
function Set-FileContent {
    param (
        [string]$Path,
        [string]$Content
    )
    [System.IO.File]::WriteAllText($Path, $Content)
}

# Write content to files
Set-FileContent -Path "src/store/useGameStore.js" -Content @"
import { create } from 'zustand'

const useGameStore = create((set) => ({
  targetCoreValues: 0,
  currentRound: 1,
  remainingCards: [],
  categories: {
    'Very Important': [],
    'Quite Important': [],
    'Important': [],
    'Of Some Importance': [],
    'Not Important': []
  },
  sessionId: '',
  setTargetCoreValues: (count) => set({ targetCoreValues: count }),
  setCurrentRound: (round) => set({ currentRound: round }),
  setRemainingCards: (cards) => set({ remainingCards: cards }),
  setCategories: (categories) => set({ categories }),
  setSessionId: (id) => set({ sessionId: id })
}))

export default useGameStore
"@

Set-FileContent -Path "src/commands/Command.js" -Content @"
export class Command {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
  }
}
"@

Set-FileContent -Path "src/commands/DropCommand.js" -Content @"
import { Command } from './Command';

export class DropCommand extends Command {
  constructor(cardId, category) {
    super('DROP', { cardId, category });
  }
}
"@

Set-FileContent -Path "src/commands/MoveCommand.js" -Content @"
import { Command } from './Command';

export class MoveCommand extends Command {
  constructor(cardId, fromCategory, toCategory) {
    super('MOVE', { cardId, fromCategory, toCategory });
  }
}
"@

Set-FileContent -Path "src/db/indexedDB.js" -Content @"
import { openDB } from 'idb';

const dbName = 'CoreValuesDB';
const dbVersion = 1;

export async function initDB() {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      db.createObjectStore('sessions', { keyPath: 'id' });
      db.createObjectStore('rounds', { keyPath: ['sessionId', 'roundNumber'] });
    },
  });
  return db;
}

export async function saveSession(session) {
  const db = await initDB();
  await db.put('sessions', session);
}

export async function saveRound(sessionId, roundNumber, commands) {
  const db = await initDB();
  await db.put('rounds', {
    sessionId,
    roundNumber,
    commands
  });
}

export async function getSessions() {
  const db = await initDB();
  return db.getAll('sessions');
}
"@

Set-FileContent -Path "src/pages/history.js" -Content @"
import { useEffect, useState } from 'react';
import { getSessions } from '../db/indexedDB';

export default function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      const loadedSessions = await getSessions();
      setSessions(loadedSessions);
    };
    loadSessions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Previous Sessions</h1>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="border p-4 rounded">
            <h2 className="font-bold">{session.id}</h2>
            <p>Date: {new Date(session.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
"@

Set-FileContent -Path "src/components/StartScreen.js" -Content @"
import { useState } from 'react';
import useGameStore from '../store/useGameStore';

export default function StartScreen({ onStart }) {
  const [coreValuesCount, setCoreValuesCount] = useState(5);
  const setTargetCoreValues = useGameStore(state => state.setTargetCoreValues);

  const handleStart = () => {
    setTargetCoreValues(coreValuesCount);
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Core Values</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          How many core values do you want to end up with?
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={coreValuesCount}
          onChange={(e) => setCoreValuesCount(Number(e.target.value))}
          className="border rounded p-2"
        />
      </div>
      <button
        onClick={handleStart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start
      </button>
    </div>
  );
}
"@

# Install required dependencies
npm install zustand react-dnd react-dnd-html5-backend idb

Write-Host "Files and directories created successfully!"
