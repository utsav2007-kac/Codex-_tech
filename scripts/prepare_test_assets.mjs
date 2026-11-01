import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('scratch_test_images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Create test image 1 (PNG: Architecture Diagram)
await sharp({
  create: {
    width: 1200,
    height: 675,
    channels: 4,
    background: { r: 37, g: 99, b: 235, alpha: 1 }
  }
})
.png()
.toFile(path.join(outDir, 'architecture-mesh-diagram.png'));

// Create test image 2 (JPEG: Benchmark Chart)
await sharp({
  create: {
    width: 800,
    height: 450,
    channels: 3,
    background: { r: 241, g: 90, b: 36 }
  }
})
.jpeg({ quality: 90 })
.toFile(path.join(outDir, 'kafka-latency-benchmarks.jpg'));

// Create test avatar (Profile photo 400x400)
await sharp({
  create: {
    width: 400,
    height: 400,
    channels: 4,
    background: { r: 16, g: 185, b: 129, alpha: 1 }
  }
})
.png()
.toFile(path.join(outDir, 'candidate-avatar-sample.png'));

// Create test SVG (Malicious/XSS simulation to prove rejection)
fs.writeFileSync(
  path.join(outDir, 'test-malicious.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg"><script>alert('xss')</script></svg>`
);

console.log('Test images created in scratch_test_images');

