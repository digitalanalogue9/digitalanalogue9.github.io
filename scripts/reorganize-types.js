const fs = require('fs-extra');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const ROOT = process.cwd();

// Define the interface movements
const typesMoves = {
  'Round': {
    targetFile: 'src/components/features/Round/types.ts',
    sourcesToRemove: [
      'src/components/features/Round/components/StatusMessageProps.tsx',
      'src/components/features/Round/CategoryGridProps.ts',
      'src/components/features/Round/RoundActionsProps.ts',
      'src/components/features/Round/RoundHeaderProps.ts',
      'src/components/features/Round/RoundUIProps.ts'
    ],
    interfaces: [
      'StatusMessageProps',
      'StatusState',
      'CategoryGridProps',
      'RoundActionsProps',
      'RoundHeaderProps',
      'RoundUIProps'
    ]
  },
  'Categories': {
    targetFile: 'src/components/features/Categories/types.ts',
    sourcesToRemove: [
      'src/components/features/Categories/components/Mobile/CategorySelectionOverlay.tsx'
    ],
    interfaces: [
      'CategorySelectionOverlayProps'
    ]
  }
};

async function extractInterfaces(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });

  const interfaces = [];
  let imports = new Set();

  traverse(ast, {
    ImportDeclaration(path) {
      imports.add(path.node.source.value);
    },
    TSInterfaceDeclaration(path) {
      if (path.node.id.name) {
        const interfaceCode = generate(path.node).code;
        interfaces.push(interfaceCode);
      }
    }
  });

  return { interfaces, imports: Array.from(imports) };
}

async function updateTypesFile(featureKey, move) {
  const targetPath = path.join(ROOT, move.targetFile);
  let content = '// Generated types file\n\n';

  // Add imports
  content += `import { Categories, CategoryName, Value } from "@/lib/types";\n\n`;

  // Extract interfaces from source files
  for (const sourceFile of move.sourcesToRemove) {
    const sourcePath = path.join(ROOT, sourceFile);
    if (await fs.pathExists(sourcePath)) {
      const { interfaces } = await extractInterfaces(sourcePath);
      content += interfaces.join('\n\n') + '\n\n';
    }
  }

  // Write the types file
  await fs.ensureFile(targetPath);
  await fs.writeFile(targetPath, content);
  console.log(`✓ Updated types file: ${move.targetFile}`);

  // Remove interfaces from original files
  for (const sourceFile of move.sourcesToRemove) {
    const sourcePath = path.join(ROOT, sourceFile);
    if (await fs.pathExists(sourcePath)) {
      const content = await fs.readFile(sourcePath, 'utf-8');
      const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      });

      let modified = false;
      traverse(ast, {
        TSInterfaceDeclaration(path) {
          if (move.interfaces.includes(path.node.id.name)) {
            path.remove();
            modified = true;
          }
        }
      });

      if (modified) {
        // Add import for the types
        const importStatement = `import type { ${move.interfaces.join(', ')} } from '../types';\n`;
        const output = importStatement + generate(ast).code;
        await fs.writeFile(sourcePath, output);
        console.log(`✓ Updated source file: ${sourceFile}`);
      }
    }
  }
}

async function main() {
  try {
    console.log('Starting types reorganization...');
    
    for (const [featureKey, move] of Object.entries(typesMoves)) {
      await updateTypesFile(featureKey, move);
    }

    console.log('\nTypes reorganization complete!');
    console.log('\nNext steps:');
    console.log('1. Review the generated types files');
    console.log('2. Update any imports that might be affected');
    console.log('3. Run TypeScript compiler to check for any issues');

  } catch (error) {
    console.error('Error during types reorganization:', error);
    process.exit(1);
  }
}

main();
