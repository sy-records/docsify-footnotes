const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const rootDir = path.resolve(__dirname, '..');
const inputFile = path.join(rootDir, 'src', 'index.js');
const distDir = path.join(rootDir, 'dist');
const outputFile = path.join(distDir, 'index.js');
const outputMinFile = path.join(distDir, 'index.min.js');
const outputMinMapFile = path.join(distDir, 'index.min.js.map');

function cleanDist() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('🧹 Cleaned up dist directory');
  }
  fs.mkdirSync(distDir, { recursive: true });
}

function buildBanner(pkg) {
  return (
    `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 *
 * Copyright (c) 2022-${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License
 */\n`
  );
}

async function build() {
  cleanDist();

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Source file not found: ${inputFile}`);
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const banner = buildBanner(pkg);
  let sourceCode = fs.readFileSync(inputFile, 'utf-8');

  const wrappedCode = `${banner}(function () {\n${sourceCode}\n})();`;
  fs.writeFileSync(outputFile, wrappedCode, 'utf-8');
  console.log('✅ Generated non-minified version (IIFE): dist/index.js');

  try {
    const minified = await minify(sourceCode, {
      compress: true,
      mangle: true,
      output: {
        preamble: banner.trimEnd(),
      },
      sourceMap: {
        filename: 'index.min.js',
        url: 'index.min.js.map'
      }
    });

    fs.writeFileSync(outputMinFile, minified.code, 'utf-8');
    console.log('✅ Generated minified version: dist/index.min.js');

    fs.writeFileSync(outputMinMapFile, minified.map, 'utf-8');
    console.log('✅ Generated minified source map: dist/index.min.js.map');
  } catch (err) {
    console.error('❌ Error during minification:', err);
  }
}

build();
