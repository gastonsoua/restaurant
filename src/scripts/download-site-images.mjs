import fs from 'fs';
import path from 'path';
import https from 'https';

const imageUrls = [
  {
    url: 'https://images.unsplash.com/photo-1540914124281-342587941389',
    filename: 'hero-image.jpg',
    description: 'Main hero image'
  },
  {
    url: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707',
    filename: 'couscous.jpg',
    description: 'Couscous dish'
  },
  {
    url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
    filename: 'brik.jpg',
    description: 'Brik dish'
  },
  {
    url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',
    filename: 'tajine.jpg',
    description: 'Tajine dish'
  },
  // Gallery images
  {
    url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b',
    filename: 'gallery1.jpg',
    description: 'Gallery image - Dish'
  },
  {
    url: 'https://images.unsplash.com/photo-1514852451047-f8e1d1cd9b64',
    filename: 'gallery2.jpg',
    description: 'Gallery image - Ingredients'
  },
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    filename: 'gallery3.jpg',
    description: 'Gallery image - Traditional cooking'
  },
  {
    url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
    filename: 'gallery4.jpg',
    description: 'Gallery image - Restaurant atmosphere'
  },
  {
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    filename: 'gallery5.jpg',
    description: 'Gallery image - Special dish'
  },
  {
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    filename: 'gallery6.jpg',
    description: 'Gallery image - Chef creation'
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
  const publicDir = path.join(process.cwd(), 'public');
  
  try {
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    for (const image of imageUrls) {
      const filepath = path.join(publicDir, image.filename);
      console.log(`Downloading ${image.filename} (${image.description})...`);
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
