const fs = require('fs-extra');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const glob = require('glob');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

// File movement mapping
const moves = {
  // Game Feature
  game: {
    base: 'src/components/features/Exercise',
    moves: [
      { from: 'src/components/Round', to: 'components/Round' },
      { from: 'src/components/Results.tsx', to: 'components/Results/index.tsx' },
      { from: 'src/components/StartScreen.tsx', to: 'components/StartScreen/index.tsx' },
      { from: 'src/components/StartScreenProps.tsx', to: 'components/StartScreen/types.ts' },
      { from: 'src/components/CoreValueReasoning.tsx', to: 'components/CoreValueReasoning/index.tsx' },
      { from: 'src/commands', to: 'commands' },
      { from: 'src/hooks/useGameState.ts', to: 'hooks/useGameState.ts' },
      { from: 'src/hooks/useCommands.ts', to: 'hooks/useCommands.ts' },
      { from: 'src/hooks/useSession.ts', to: 'hooks/useSession.ts' },
      { from: 'src/utils/game', to: 'utils' }
    ]
  },

  // Cards Feature
  cards: {
    base: 'src/components/features/Cards',
    moves: [
      { from: 'src/components/Card', to: 'components' },
      { from: 'src/hooks/useCardDragAnimation.ts', to: 'hooks/useCardDragAnimation.ts' },
      { from: 'src/components/Mobile/MobileCardActions.tsx', to: 'components/MobileCardActions/index.tsx' }
    ]
  },

  // Categories Feature
  categories: {
    base: 'src/components/features/Categories',
    moves: [
      { from: 'src/components/CategoryColumn.tsx', to: 'components/CategoryColumn/index.tsx' },
      { from: 'src/components/CategoryColumnProps.tsx', to: 'components/CategoryColumn/types.ts' },
      { from: 'src/constants/categories.ts', to: 'constants/categories.ts' },
      { from: 'src/utils/categoryUtils.ts', to: 'utils/categoryUtils.ts' },
      { from: 'src/components/Mobile/CategorySelectionOverlay.tsx', to: 'components/Mobile/CategorySelectionOverlay.tsx' }
    ]
  },

  // History Feature
  history: {
    base: 'src/components/features/History',
    moves: [
      { from: 'src/components/History/SessionList.tsx', to: 'components/SessionList/index.tsx' }
    ]
  },

  // Replay Feature
  replay: {
    base: 'src/components/features/Replay',
    moves: [
      { from: 'src/components/Replay/ReplayClient.tsx', to: 'components/ReplayClient/index.tsx' },
      { from: 'src/components/Replay/components/ReplayColumn.tsx', to: 'components/ReplayColumn/index.tsx' },
      { from: 'src/components/Replay/components/MobileReplayCategories.tsx', to: 'components/MobileReplayCategories/index.tsx' },
      { from: 'src/components/Replay/hooks/useCardAnimation.ts', to: 'hooks/useCardAnimation.ts' },
      { from: 'src/components/Replay/hooks/useReplayState.ts', to: 'hooks/useReplayState.ts' }
    ]
  },

  // Common Components
  common: {
    base: 'src/components/common',
    moves: [
      { from: 'src/components/Navigation.tsx', to: 'Navigation/index.tsx' },
      { from: 'src/components/Instructions.tsx', to: 'Instructions/index.tsx' },
      { from: 'src/components/InstructionsProps.tsx', to: 'Instructions/types.ts' },
      { from: 'src/components/OfflineIndicator.tsx', to: 'OfflineIndicator/index.tsx' },
      { from: 'src/components/PWAPrompt.tsx', to: 'PWAPrompt/index.tsx' },
      { from: 'src/components/CentredImage.tsx', to: 'CentredImage/index.tsx' }
    ]
  },

  // Library
  lib: {
    base: 'src/lib',
    moves: [
      { from: 'src/contexts/MobileContext.tsx', to: 'contexts/MobileContext.tsx' },
      { from: 'src/store', to: 'store' },
      { from: 'src/db', to: 'db' },
      { from: 'src/types', to: 'types' },
      { from: 'src/worker', to: 'worker' },
      { from: 'src/utils/animation', to: 'utils/animation' },
      { from: 'src/utils/cache', to: 'utils/cache' },
      { from: 'src/utils/config', to: 'utils/config' },
      { from: 'src/utils/dom', to: 'utils/dom' },
      { from: 'src/utils/storage', to: 'utils/storage' },
      { from: 'src/utils/debug', to: 'utils/debug' },
      { from: 'src/hooks/useAnimation.ts', to: 'hooks/useAnimation.ts' },
      { from: 'src/hooks/usePWA.ts', to: 'hooks/usePWA.ts' }
    ]
  },

  // Assets
  assets: {
    base: 'src',
    moves: [
      { from: 'src/app/globals.css', to: 'styles/globals.css' },
      { from: 'src/app/fonts', to: 'assets/fonts' }
    ]
  }
};

// Import mappings for updating import statements
const importMappings = {
  '@/components/Card': '@/features/Cards',
  '@/components/Round': '@/features/Exercise/components/Round',
  '@/components/Mobile': '@/features/Mobile',
  '@/components/History': '@/features/History',
  '@/components/Replay': '@/features/Replay',
  '@/hooks/useGameState': '@/features/Exercise/hooks/useGameState',
  '@/hooks/useCommands': '@/features/Exercise/hooks/useCommands',
  '@/hooks/useSession': '@/features/Exercise/hooks/useSession',
  '@/hooks/useCardDragAnimation': '@/features/Cards/hooks/useCardDragAnimation',
  '@/contexts/MobileContext': '@/lib/contexts/MobileContext',
  '@/utils/game': '@/features/Exercise/utils',
  '@/utils/categoryUtils': '@/features/Categories/utils/categoryUtils',
  '@/constants/categories': '@/features/Categories/constants/categories',
  '@/types': '@/lib/types',
  '@/store': '@/lib/store',
  '@/db': '@/lib/db',
  '@/worker': '@/lib/worker'
};

async function createDirectories() {
  const allDirs = Object.values(moves).map(({ base }) => base);
  for (const dir of allDirs) {
    await fs.ensureDir(path.join(ROOT, dir));
    console.log(`Created directory: ${dir}`);
  }
}

async function moveFiles() {
  for (const feature of Object.values(moves)) {
    for (const move of feature.moves) {
      const fromPath = path.join(ROOT, move.from);
      const toPath = path.join(ROOT, feature.base, move.to);
      
      try {
        if (await fs.pathExists(fromPath)) {
          await fs.ensureDir(path.dirname(toPath));
          await fs.move(fromPath, toPath, { overwrite: true });
          console.log(`Moved: ${move.from} -> ${feature.base}/${move.to}`);
        } else {
          console.log(`Source not found: ${move.from}`);
        }
      } catch (error) {
        console.error(`Error moving ${move.from}:`, error);
      }
    }
  }
}

async function updateImports(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    let modified = false;

    traverse(ast, {
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        
        for (const [oldPath, newPath] of Object.entries(importMappings)) {
          if (importPath.startsWith(oldPath)) {
            path.node.source.value = importPath.replace(oldPath, newPath);
            modified = true;
            break;
          }
        }
      }
    });

    if (modified) {
      const output = generate(ast, {}, content);
      await fs.writeFile(filePath, output.code);
      console.log(`Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing imports in ${filePath}:`, error);
  }
}

async function updateAllImports() {
  const files = glob.sync(path.join(SRC, '**/*.{ts,tsx}'));
  for (const file of files) {
    await updateImports(file);
  }
}

async function updateTsConfig() {
  const tsconfigPath = path.join(ROOT, 'tsconfig.json');
  const tsconfig = await fs.readJSON(tsconfigPath);

  tsconfig.compilerOptions.paths = {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/features/*": ["./src/components/features/*"],
    "@/common/*": ["./src/components/common/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/styles/*": ["./src/styles/*"],
    "@/assets/*": ["./src/assets/*"]
  };

  await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
  console.log('Updated tsconfig.json paths');
}

async function main() {
  try {
    console.log('Starting codebase reorganization...');
    await createDirectories();
    await moveFiles();
    await updateAllImports();
    await updateTsConfig();
    console.log('Reorganization complete!');
  } catch (error) {
    console.error('Error during reorganization:', error);
    process.exit(1);
  }
}

main();
