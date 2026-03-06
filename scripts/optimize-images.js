import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coverDirs = ['A', 'LA', 'MA', 'SC', 'SS', 'R', 'L', 'FR', 'FA', 'SEA', 'FCT', 'FCP'];

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(800, null, { // Max width 800px, maintain aspect ratio
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 }) // Convert to WebP with 85% quality
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function processDirectory(dir) {
  const dirPath = path.join(path.dirname(__dirname), 'public/covers', dir);

  if (!fs.existsSync(dirPath)) {
    console.log(`  ⚠️  Directory not found, skipping...`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  const pngFiles = files.filter(f => f.endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log(`  ℹ️  No PNG files found`);
    return;
  }

  let totalInputSize = 0;
  let totalOutputSize = 0;
  let successCount = 0;

  for (const file of pngFiles) {
    const inputPath = path.join(dirPath, file);
    const outputPath = path.join(dirPath, file.replace('.png', '.webp'));

    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭️  ${file} → Already optimized, skipping`);
      continue;
    }

    console.log(`  🔄 ${file}...`);
    const success = await optimizeImage(inputPath, outputPath);

    if (success) {
      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

      totalInputSize += inputSize;
      totalOutputSize += outputSize;
      successCount++;

      console.log(`     ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller) ✅`);
    }
  }

  if (successCount > 0) {
    const totalSavings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);
    console.log(`  📊 Total: ${(totalInputSize / 1024 / 1024).toFixed(2)}MB → ${(totalOutputSize / 1024 / 1024).toFixed(2)}MB (${totalSavings}% reduction)`);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log('This will convert PNG images to WebP format with 85% quality');
  console.log('Max width: 800px (maintains aspect ratio)\n');

  let grandTotalInput = 0;
  let grandTotalOutput = 0;

  for (const dir of coverDirs) {
    console.log(`📁 Processing covers/${dir}/...`);
    await processDirectory(dir);
    console.log('');
  }

  console.log('✅ Image optimization complete!\n');
  console.log('Next steps:');
  console.log('1. Update src/config/workbookConfig.ts to use .webp instead of .png');
  console.log('2. Update src/config/flashcardConfig.ts to use .webp instead of .png');
  console.log('3. Test locally: npm run dev');
  console.log('4. Build and deploy: npm run build && vercel --prod');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
