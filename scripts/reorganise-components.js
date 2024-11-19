const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const readline = require('readline');

const ROOT = process.cwd();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Define the desired order of sections
const SECTION_ORDER = [
  'imports',
  'interfaces',
  'types',
  'constants',
  'refs',
  'hooks',
  'state',
  'effects',
  'handlers',
  'render'
];

function identifySection(node) {
  if (t.isVariableDeclaration(node)) {
    // Check for useState
    if (node.declarations.some(dec => 
      t.isCallExpression(dec.init) && 
      t.isIdentifier(dec.init.callee) && 
      dec.init.callee.name === 'useState'
    )) {
      return 'state';
    }
    
    // Check for useRef
    if (node.declarations.some(dec => 
      t.isCallExpression(dec.init) && 
      t.isIdentifier(dec.init.callee) && 
      dec.init.callee.name === 'useRef'
    )) {
      return 'refs';
    }
    
    // Check for other hooks
    if (node.declarations.some(dec => 
      t.isCallExpression(dec.init) && 
      t.isIdentifier(dec.init.callee) && 
      dec.init.callee.name.startsWith('use')
    )) {
      return 'hooks';
    }

    // Check for constants
    if (node.kind === 'const' && !node.declarations.some(dec => 
      t.isCallExpression(dec.init) && 
      t.isIdentifier(dec.init.callee) && 
      dec.init.callee.name.startsWith('use')
    )) {
      return 'constants';
    }
  }

  // Check for useEffect
  if (t.isExpressionStatement(node) && 
      t.isCallExpression(node.expression) && 
      t.isIdentifier(node.expression.callee) && 
      node.expression.callee.name === 'useEffect') {
    return 'effects';
  }

  // Check for handlers
  if (t.isFunctionDeclaration(node) || 
      (t.isVariableDeclaration(node) && 
       node.declarations.some(dec => 
         t.isArrowFunctionExpression(dec.init) || 
         t.isFunctionExpression(dec.init)
       ))) {
    const name = t.isFunctionDeclaration(node) ? 
      node.id.name : 
      node.declarations[0].id.name;
    if (name.startsWith('handle') || name.includes('Handler')) {
      return 'handlers';
    }
  }

  // Check for interfaces and types
  if (t.isTSInterfaceDeclaration(node)) {
    return 'interfaces';
  }
  if (t.isTSTypeAliasDeclaration(node)) {
    return 'types';
  }

  return null;
}

async function analyzeComponent(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const issues = [];
  
  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    let componentBody = null;
    let currentSectionOrder = [];

    traverse(ast, {
      FunctionDeclaration(path) {
        if (path.node.body.type === 'BlockStatement') {
          componentBody = path;
          path.node.body.body.forEach(node => {
            const section = identifySection(node);
            if (section) {
              currentSectionOrder.push(section);
            }
          });
        }
      },
      ArrowFunctionExpression(path) {
        if (path.node.body.type === 'BlockStatement') {
          componentBody = path;
          path.node.body.body.forEach(node => {
            const section = identifySection(node);
            if (section) {
              currentSectionOrder.push(section);
            }
          });
        }
      }
    });

    if (!componentBody) {
      return null;
    }

    // Check for section order issues
    let lastSectionIndex = -1;
    currentSectionOrder.forEach((section, index) => {
      const sectionIndex = SECTION_ORDER.indexOf(section);
      if (sectionIndex < lastSectionIndex) {
        issues.push(`${section} appears after ${SECTION_ORDER[lastSectionIndex]}`);
      }
      lastSectionIndex = Math.max(lastSectionIndex, sectionIndex);
    });

    return {
      hasIssues: issues.length > 0,
      issues,
      currentOrder: currentSectionOrder
    };

  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
    return null;
  }
}

async function analyzeComponentStructure(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const details = {
    stateDeclarations: [],
    hooksUsed: [],
    effectsCount: 0,
    handlersCount: 0,
    orderIssues: []
  };
  
  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    traverse(ast, {
      VariableDeclaration(path) {
        path.node.declarations.forEach(dec => {
          // Collect state declarations
          if (t.isCallExpression(dec.init) && 
              t.isIdentifier(dec.init.callee) && 
              dec.init.callee.name === 'useState') {
            if (t.isArrayPattern(dec.id)) {
              const stateName = dec.id.elements[0].name;
              details.stateDeclarations.push(stateName);
            }
          }
          
          // Collect hook usage
          if (t.isCallExpression(dec.init) && 
              t.isIdentifier(dec.init.callee) && 
              dec.init.callee.name.startsWith('use')) {
            details.hooksUsed.push(dec.init.callee.name);
          }
        });
      },
      
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee) && 
            path.node.callee.name === 'useEffect') {
          details.effectsCount++;
        }
      },
      
      FunctionDeclaration(path) {
        if (path.node.id.name.startsWith('handle')) {
          details.handlersCount++;
        }
      },
      
      ArrowFunctionExpression(path) {
        const parentNode = path.parent;
        if (t.isVariableDeclarator(parentNode) && 
            t.isIdentifier(parentNode.id) && 
            parentNode.id.name.startsWith('handle')) {
          details.handlersCount++;
        }
      }
    });

    return details;

  } catch (error) {
    console.error(`Error analyzing structure of ${filePath}:`, error);
    return null;
  }
}

async function reorganizeComponent(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    let componentBody = null;
    let sections = {
      imports: [],
      interfaces: [],
      types: [],
      constants: [],
      refs: [],
      hooks: [],
      state: [],
      effects: [],
      handlers: [],
      render: []
    };

    traverse(ast, {
      Program(path) {
        // Handle top-level imports
        path.node.body.forEach(node => {
          if (t.isImportDeclaration(node)) {
            sections.imports.push(node);
          }
        });
      },
      
      FunctionDeclaration(path) {
        if (path.node.body.type === 'BlockStatement') {
          componentBody = path;
        }
      },
      
      ArrowFunctionExpression(path) {
        if (path.node.body.type === 'BlockStatement') {
          componentBody = path;
        }
      }
    });

    if (!componentBody) {
      return false;
    }

    // Categorize statements
    componentBody.node.body.body.forEach(node => {
      const section = identifySection(node);
      if (section) {
        sections[section].push(node);
      } else {
        sections.render.push(node);
      }
    });

    // Rebuild the body in the correct order
    const newBody = [];
    SECTION_ORDER.forEach(section => {
      if (sections[section].length > 0) {
        newBody.push(t.commentBlock(` ${section} `, true));
        newBody.push(...sections[section]);
        newBody.push(t.emptyStatement());
      }
    });

    componentBody.node.body.body = newBody;

    const output = generate(ast, {
      retainLines: true,
      comments: true
    }, content);

    await fs.writeFile(filePath, output.code);
    return true;

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  try {
    console.log('Analyzing components...\n');
    
    // Find all component files
    const files = glob.sync(path.join(ROOT, 'src', 'components', '**', '*.tsx'));
    
    // Filter out index files and type files
    const componentFiles = files.filter(file => 
      !file.endsWith('index.tsx') && 
      !file.endsWith('.types.tsx') &&
      !file.includes('.test.') &&
      !file.endsWith('Props.tsx')
    );

    // Analyze all components first
    const analysisResults = [];
    for (const file of componentFiles) {
      const analysis = await analyzeComponent(file);
      const details = await analyzeComponentStructure(file);
      if ((analysis && analysis.hasIssues) || details) {
        analysisResults.push({
          file,
          ...analysis,
          details
        });
      }
    }

    if (analysisResults.length === 0) {
      console.log('No components need reorganization.');
      rl.close();
      return;
    }

    // Ask what to do
    const answer = await question(
      'Would you like to:\n' +
      '1. Show detailed report only (no changes)\n' +
      '2. Fix all components\n' +
      '3. Fix components one by one\n' +
      '4. Exit\n' +
      'Enter your choice (1-4): '
    );

    switch (answer) {
      case '1':
        console.log('\nDetailed Component Analysis:\n');
        analysisResults.forEach(({ file, issues, details }) => {
          console.log(`\nFile: ${path.relative(ROOT, file)}`);
          console.log('----------------------------------------');
          if (issues && issues.length > 0) {
            console.log('\nOrder Issues:');
            issues.forEach(issue => console.log(`  - ${issue}`));
          }
          if (details) {
            console.log('\nComponent Structure:');
            if (details.stateDeclarations.length > 0) {
              console.log(`  State declarations (${details.stateDeclarations.length}):`);
              details.stateDeclarations.forEach(state => console.log(`    - ${state}`));
            }
            if (details.hooksUsed.length > 0) {
              console.log(`  Hooks used (${details.hooksUsed.length}):`);
              details.hooksUsed.forEach(hook => console.log(`    - ${hook}`));
            }
            console.log(`  Effects count: ${details.effectsCount}`);
            console.log(`  Handlers count: ${details.handlersCount}`);
          }
          console.log('----------------------------------------\n');
        });
        break;

      case '2':
        console.log('\nFixing all components...');
        for (const { file } of analysisResults) {
          const success = await reorganizeComponent(file);
          console.log(`${success ? '✓' : '✗'} ${path.relative(ROOT, file)}`);
        }
        break;

      case '3':
        console.log('\nFixing components one by one...');
        for (const { file } of analysisResults) {
          const shouldFix = await question(`Fix ${path.relative(ROOT, file)}? (y/n): `);
          if (shouldFix.toLowerCase() === 'y') {
            const success = await reorganizeComponent(file);
            console.log(`${success ? '✓' : '✗'} ${path.relative(ROOT, file)}`);
          }
        }
        break;

      case '4':
      default:
        console.log('Exiting without making changes.');
        break;
    }

    console.log('\nDone!');
    rl.close();

  } catch (error) {
    console.error('Error during component analysis:', error);
    rl.close();
    process.exit(1);
  }
}

main();
