import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("img");
const outputDir = path.resolve("processed");

// Ensure processed folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function processImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize({ width: 1080 }) // Resize width, keep aspect ratio
      .jpeg({ quality: 70 }) // Compress
      .toFile(outputPath);

    console.log(`✅ ${inputPath} → ${outputPath}`);
  } catch (err) {
    console.error(`❌ Error processing ${inputPath}:`, err.message);
  }
}

// Recursive function to process all folders & images
function walkAndProcess(currentInput, currentOutput) {
  if (!fs.existsSync(currentOutput)) {
    fs.mkdirSync(currentOutput, { recursive: true });
  }

  const entries = fs.readdirSync(currentInput, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(currentInput, entry.name);
    const outputPath = path.join(currentOutput, entry.name);

    if (entry.isDirectory()) {
      // Dive into subfolder
      walkAndProcess(inputPath, outputPath);
    } else {
      // Process only image files
      const ext = path.extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        // Save as JPG (change ext)
        const newOutput = outputPath.replace(ext, ".jpg");
        processImage(inputPath, newOutput);
      }
    }
  }
}

// Start processing
walkAndProcess(inputDir, outputDir);
