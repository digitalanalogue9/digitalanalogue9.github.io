const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

const importMappings = {
  // Types
  '@/types': '@/lib/types',
  '@/types/Value': '@/lib/types',

  // Commands
  '@/commands/DropCommand': '@/components/features/Game/commands/DropCommand',
  '@/commands/MoveCommand': '@/components/features/Game/commands/MoveCommand',
  '@/commands/BaseCommand': '@/components/features/Game/commands/BaseCommand',
  '@/commands': '@/components/features/Game/commands',

  // Components
  '@/components/Round': '@/components/features/Round',
  '@/components/Card': '@/components/features/Cards/components',
  '@/components/Results': '@/components/features/Game/components/Results',
  '@/components/StartScreen': '@/components/features/Game/components/StartScreen',
  '@/components/Instructions': '@/components/common/Instructions',
  '@/components/PWAPrompt': '@/components/common/PWAPrompt',
  '@/components/CategoryColumn': '@/components/features/Categories/components/CategoryColumn',
  '../components/Round': '@/components/features/Round',
  '../components/StartScreen': '@/components/features/Game/components/StartScreen',
  '../components/Instructions': '@/components/common/Instructions',
  '../CategoryColumn': '@/components/features/Categories/components/CategoryColumn',
  './Card': '@/components/features/Cards/components',

  // Hooks
  '@/hooks/useGameState': '@/components/features/Game/hooks/useGameState',
  '@/hooks/useSession': '@/components/features/Game/hooks/useSession',
  '@/hooks/useCommands': '@/components/features/Game/hooks/useCommands',
  '@/hooks/usePWA': '@/lib/hooks/usePWA',
  '../hooks/useGameState': '@/components/features/Game/hooks/useGameState',
  '../hooks/useSession': '@/components/features/Game/hooks/useSession',
  '../hooks/usePWA': '@/lib/hooks/usePWA',

  // Utils
  '@/utils': '@/lib/utils',
  '@/utils/storage': '@/lib/utils/storage',
  '@/utils/cache': '@/lib/utils/cache',
  '../utils/storage': '@/lib/utils/storage',
  '@/utils/debug/renderLogger': '@/lib/utils/debug/renderLogger',
  '@/utils/config': '@/lib/utils/config',
  '@/utils/categoryUtils': '@/components/features/Categories/utils/categoryUtils',

  // DB
  '@/db/indexedDB': '@/lib/db/indexedDB',
  '../db/indexedDB': '@/lib/db/indexedDB',

  // Store
  '@/store/store': '@/lib/store/store',

  // Contexts
  '@/contexts/MobileContext': '@/lib/contexts/MobileContext',

  // Data
  '../data/values.json': '@/data/values.json',
};

async function updateImports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Parse the file
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    // Track any imports that weren't mapped
    const unmappedImports = new Set();

    traverse(ast, {
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        let wasUpdated = false;

        // Handle both absolute and relative imports
        if (importPath.startsWith('@/') || importPath.startsWith('.')) {
          for (const [oldPath, newPath] of Object.entries(importMappings)) {
            if (importPath === oldPath || importPath.startsWith(oldPath + '/')) {
              path.node.source.value = importPath.replace(oldPath, newPath);
              modified = true;
              wasUpdated = true;
              break;
            }
          }

          if (!wasUpdated && (importPath.startsWith('@/') || importPath.startsWith('..'))) {
            unmappedImports.add(importPath);
          }
        }
      }
    });

    if (modified) {
      const output = generate(ast, {}, content);
      await fs.writeFile(filePath, output.code);
      console.log(`✓ Updated imports in: ${filePath}`);
    }

    if (unmappedImports.size > 0) {
      console.log(`\n⚠️  Unmapped imports in ${filePath}:`);
      unmappedImports.forEach(imp => console.log(`   ${imp}`));
    }

  } catch (error) {
    console.error(`\n✗ Error processing ${filePath}:`, error.message);
    console.error(`   File: ${filePath}`);
  }
}

async function main() {
  try {
    console.log('Starting import path updates...');
    
    // Get all TypeScript/JavaScript files
    const files = glob.sync('**/*.{ts,tsx}', {
      cwd: SRC,
      absolute: true,
      nodir: true,
      windowsPathsNoEscape: true
    });
    
    console.log(`Found ${files.length} files to process`);

    if (files.length === 0) {
      console.log('No files found to process');
      return;
    }

    // Sort files to process in a predictable order
    files.sort();
    
    let processedCount = 0;
    let errorCount = 0;
    
    // Process each file
    for (const file of files) {
      try {
        await updateImports(file);
        processedCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to process ${file}:`, error);
      }
    }

    console.log('\nImport updates complete!');
    console.log(`Processed ${processedCount} files`);
    if (errorCount > 0) console.log(`Encountered ${errorCount} errors`);

  } catch (error) {
    console.error('Error during import updates:', error);
    process.exit(1);
  }
}

main();
