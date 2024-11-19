const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

// Comprehensive import mappings based on the new structure
const importMappings = {
  // Base mappings for major sections
  '@/components/features': '@/components/features',
  '@/components/common': '@/components/common',
  '@/lib': '@/lib',

  // Feature-specific mappings
  '@/components/Round': '@/components/features/Round',
  '@/components/Card': '@/components/features/Cards/components',
  '@/components/History': '@/components/features/History/components',
  '@/components/Replay': '@/components/features/Replay/components',
  '@/components/CategoryColumn': '@/components/features/Categories/components/CategoryColumn',
  '@/components/StartScreen': '@/components/features/Game/components/StartScreen',
  '@/components/Results': '@/components/features/Game/components/Results',
  '@/components/CoreValueReasoning': '@/components/features/Game/components/CoreValueReasoning',

  // Common components
  '@/components/Navigation': '@/components/common/Navigation',
  '@/components/Instructions': '@/components/common/Instructions',
  '@/components/PWAPrompt': '@/components/common/PWAPrompt',
  '@/components/OfflineIndicator': '@/components/common/OfflineIndicator',
  '@/components/CentredImage': '@/components/common/CentredImage',

  // Hooks
  '@/hooks/useGameState': '@/components/features/Game/hooks/useGameState',
  '@/hooks/useCommands': '@/components/features/Game/hooks/useCommands',
  '@/hooks/useSession': '@/components/features/Game/hooks/useSession',
  '@/hooks/useCardDragAnimation': '@/components/features/Cards/hooks/useCardDragAnimation',
  '@/hooks/useSessionReconstruction': '@/components/features/Replay/hooks/useSessionReconstruction',
  '@/hooks/useAnimation': '@/lib/hooks/useAnimation',
  '@/hooks/usePWA': '@/lib/hooks/usePWA',

  // Utils
  '@/utils/storage': '@/lib/utils/storage',
  '@/utils/cache': '@/lib/utils/cache',
  '@/utils/email': '@/lib/utils/email',
  '@/utils/dom': '@/lib/utils/dom',
  '@/utils/config': '@/lib/utils/config',
  '@/utils/animation': '@/lib/utils/animation',
  '@/utils/debug': '@/lib/utils/debug',
  '@/utils/game': '@/components/features/Game/utils',
  '@/utils/categoryUtils': '@/components/features/Categories/utils/categoryUtils',

  // Types
  '@/types': '@/lib/types',

  // Other core items
  '@/db': '@/lib/db',
  '@/store': '@/lib/store',
  '@/contexts': '@/lib/contexts',
  '@/constants': '@/components/features/Categories/constants',

  // Relative path mappings
  '../components/Round': '@/components/features/Round',
  '../components/StartScreen': '@/components/features/Game/components/StartScreen',
  '../components/Instructions': '@/components/common/Instructions',
  '../components/Navigation': '@/components/common/Navigation',
  '../components/PWAPrompt': '@/components/common/PWAPrompt',
  '../hooks/useGameState': '@/components/features/Game/hooks/useGameState',
  '../hooks/useSession': '@/components/features/Game/hooks/useSession',
  '../hooks/usePWA': '@/lib/hooks/usePWA',
  '../db/indexedDB': '@/lib/db/indexedDB',
  '../utils/storage': '@/lib/utils/storage',
  '../utils/cache': '@/lib/utils/cache',
  '../data/values.json': '@/data/values.json'
};

function createRelativeMapping(importPath) {
  // Convert relative paths to absolute paths for consistent handling
  if (importPath.startsWith('../')) {
    const absolutePath = importPath.replace('../', '@/');
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      if (absolutePath.startsWith(oldPath)) {
        return newPath + absolutePath.slice(oldPath.length);
      }
    }
  }
  return null;
}

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

        // Handle relative paths
        if (importPath.startsWith('../')) {
          const newPath = createRelativeMapping(importPath);
          if (newPath) {
            path.node.source.value = newPath;
            modified = true;
            wasUpdated = true;
          }
        } 
        // Handle absolute paths
        else if (importPath.startsWith('@/')) {
          for (const [oldPath, newPath] of Object.entries(importMappings)) {
            if (importPath.startsWith(oldPath)) {
              path.node.source.value = importPath.replace(oldPath, newPath);
              modified = true;
              wasUpdated = true;
              break;
            }
          }
        }

        if (!wasUpdated && (importPath.startsWith('@/') || importPath.startsWith('..'))) {
          unmappedImports.add(importPath);
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
        console.log('Source directory:', SRC);

        // Modified glob pattern for Windows
        const files = glob.sync('**/*.{ts,tsx}', {
            cwd: SRC,
            absolute: true,
            nodir: true,
            windowsPathsNoEscape: true
        });

        console.log(`Found ${files.length} files to process`);

        if (files.length === 0) {
            console.log('Searched in:', SRC);
            console.log('No files found. Please check the path.');
            return;
        }

        // Sort files to process in a predictable order
        files.sort();

        // Log first few files to verify correct paths
        console.log('\nFirst few files to process:');
        files.slice(0, 5).forEach(f => console.log(f));

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
