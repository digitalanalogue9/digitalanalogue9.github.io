const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const ROOT = process.cwd();

// Files to remove
const propsFilesToRemove = [
  'src/components/features/Round/CategoryGridProps.ts',
  'src/components/features/Round/RoundActionsProps.ts',
  'src/components/features/Round/RoundHeaderProps.ts',
  'src/components/features/Round/RoundUIProps.ts',
  'src/components/features/Round/components/StatusMessageProps.tsx',
  'src/components/features/Categories/components/CategoryColumn/types.ts',
  'src/components/features/Cards/components/types.ts'
];

// Update Round/types.ts with StatusState interface
async function updateRoundTypes() {
  const roundTypesPath = path.join(ROOT, 'src/components/features/Round/types.ts');
  const statusHookPath = path.join(ROOT, 'src/components/features/Round/hooks/useRoundStatus.ts');

  try {
    // Read the StatusState interface from useRoundStatus.ts
    const hookContent = await fs.readFile(statusHookPath, 'utf-8');
    const ast = parser.parse(hookContent, {
      sourceType: 'module',
      plugins: ['typescript']
    });

    let statusStateInterface = '';
    traverse(ast, {
      TSInterfaceDeclaration(path) {
        if (path.node.id.name === 'StatusState') {
          statusStateInterface = generate(path.node).code;
        }
      }
    });

    // Add it to types.ts if it's not already there
    const typesContent = await fs.readFile(roundTypesPath, 'utf-8');
    if (!typesContent.includes('interface StatusState')) {
      const updatedContent = `${typesContent}\n\n${statusStateInterface}\n`;
      await fs.writeFile(roundTypesPath, updatedContent);
    }

    // Remove interface from useRoundStatus.ts
    const updatedHookContent = hookContent.replace(/export\s+interface\s+StatusState[\s\S]*?}\n/, '');
    await fs.writeFile(statusHookPath, updatedHookContent);

    console.log('✓ Updated Round types');
  } catch (error) {
    console.error('Error updating Round types:', error);
  }
}

// Update imports in all files to use the new type locations
async function updateImports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    let modified = false;

    traverse(ast, {
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        // Update imports to use feature-level types
        if (importPath.includes('/components/types')) {
          path.node.source.value = importPath.replace('/components/types', '/types');
          modified = true;
        }
        // Update relative Props imports to use types
        if (importPath.endsWith('Props') || importPath.includes('/types')) {
          const currentDir = path.dirname(filePath);
          const featureDir = findFeatureDir(currentDir);
          if (featureDir) {
            path.node.source.value = path.relative(currentDir, path.join(featureDir, 'types'));
            if (!path.node.source.value.startsWith('.')) {
              path.node.source.value = './' + path.node.source.value;
            }
            modified = true;
          }
        }
      }
    });

    if (modified) {
      const output = generate(ast, {}, content);
      await fs.writeFile(filePath, output.code);
      console.log(`✓ Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error);
  }
}

// Helper function to find the feature directory
function findFeatureDir(dir) {
  const parts = dir.split(path.sep);
  const featuresIndex = parts.indexOf('features');
  if (featuresIndex === -1) return null;
  return parts.slice(0, featuresIndex + 2).join(path.sep);
}

// Remove Props files
async function removePropsFiles() {
  for (const file of propsFilesToRemove) {
    const filePath = path.join(ROOT, file);
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        console.log(`✓ Removed: ${file}`);
      }
    } catch (error) {
      console.error(`Error removing ${file}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('Updating types organization...');
    
    // Remove Props files
    await removePropsFiles();

    // Update Round types
    await updateRoundTypes();

    // Update imports in all TypeScript files
    const files = glob.sync(path.join(ROOT, 'src', '**', '*.{ts,tsx}'));
    for (const file of files) {
      await updateImports(file);
    }

    console.log('\nTypes update complete!');

  } catch (error) {
    console.error('Error during types update:', error);
    process.exit(1);
  }
}

main();
