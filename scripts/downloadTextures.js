const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = [
  '8k_sun.jpg',
  '8k_mercury.jpg',
  '8k_venus_surface.jpg',
  '8k_earth_daymap.jpg',
  '8k_earth_nightmap.jpg',
  '8k_earth_clouds.jpg',
  '8k_mars.jpg',
  '8k_jupiter.jpg',
  '8k_saturn.jpg',
  '8k_saturn_ring_alpha.png',
  '2k_uranus.jpg',
  '2k_neptune.jpg',
  '8k_moon.jpg',
  '8k_stars_milky_way.jpg'
];

const targetDir = path.join(__dirname, '..', 'public', 'textures');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Starting high-res texture downloads...');

async function downloadFile(filename) {
  const dest = path.join(targetDir, filename);
  
  // Overwrite if file doesn't exist OR is 0 bytes
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log(`Skipping ${filename} (already exists and has data)`);
    return;
  }

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.solarsystemscope.com/textures/'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(`https://www.solarsystemscope.com/textures/download/${filename}`, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Simple redirect handler
        https.get(res.headers.location, options, (res2) => {
           const file = fs.createWriteStream(dest);
           res2.pipe(file);
           file.on('finish', () => { file.close(); resolve(); });
        });
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed ${filename}: ${res.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  for (const t of textures) {
    try {
      await downloadFile(t);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('Download complete.');
}

run();
