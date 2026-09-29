const fs = require('fs');
const https = require('https');
const path = require('path');

const fontsToDownload = [
  {
    name: 'SamsungOneUI_4_Xmas.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/SamsungOneUI_4_Xmas.ttf'
  },
  {
    name: 'Samsung_OneUI_4.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/Samsung_OneUI_4.ttf'
  },
  {
    name: 'Facebook15.0.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/2024/Facebook15.0.ttf'
  },
  {
    name: 'Twemoji-v15.0.3.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/2024/Twemoji-v15.0.3.ttf'
  },
  {
    name: 'OneUI6.1.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/2024/OneUI6.1.ttf'
  },
  {
    name: 'unofficial_iOS18_S.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/2024/unofficial_iOS18_S.ttf'
  },
  {
    name: 'Joypixel_v9.0.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/2024/Joypixel_v9.0(MFFMEmoji).ttf'
  },
  {
    name: 'Windows11.ttf',
    url: 'https://raw.githubusercontent.com/zFont/Host/main/Font/Emoji/Windows11.ttf'
  }
];

const targetDir = path.join(__dirname, '..', 'public', 'fonts', 'emoji');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(item) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, item.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000000) {
      console.log(`[Already Exists] ${item.name} (${fs.statSync(dest).size} bytes)`);
      return resolve(true);
    }
    console.log(`[Downloading] ${item.name} from ${item.url}...`);
    const file = fs.createWriteStream(dest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed ${item.name}: Status ${res.statusCode}`);
        file.close();
        fs.unlinkSync(dest);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`[Done] ${item.name} (${fs.statSync(dest).size} bytes)`);
          resolve(true);
        });
      });
    }).on('error', (err) => {
      console.error(`[Error] ${item.name}:`, err.message);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

(async () => {
  for (const item of fontsToDownload) {
    await download(item);
  }
  console.log('All downloads finished!');
})();
