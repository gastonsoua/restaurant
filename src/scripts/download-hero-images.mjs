import fs from 'fs';
import path from 'path';
import https from 'https';

const imageUrls = [
  {
    url: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707',
    filename: 'tunisian-couscous.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
    filename: 'restaurant-interior.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',
    filename: 'tajine.jpg'
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve();
        });
      } else {
        reject(`Failed to download ${url}`);
      }
    }).on('error', reject);
  });
};

async function main() {
  const heroImagesDir = path.join(process.cwd(), 'public', 'images', 'hero');
  
  try {
    fs.mkdirSync(heroImagesDir, { recursive: true });
    
    for (const image of imageUrls) {
      const filepath = path.join(heroImagesDir, image.filename);
      console.log(`Downloading ${image.filename}...`);
      await downloadImage(image.url, filepath);
      console.log(`Downloaded ${image.filename}`);
    }
    
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
}

main();
