import https from 'https';
import fs from 'fs';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070',
    file: 'public/gallery1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070',
    file: 'public/gallery2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070',
    file: 'public/gallery3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1567529692333-de9fd6772897?q=80&w=2070',
    file: 'public/gallery4.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2070',
    file: 'public/gallery5.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2070',
    file: 'public/gallery6.jpg'
  }
];

for (const image of images) {
  const file = fs.createWriteStream(image.file);
  https.get(image.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${image.file}`);
    });
  }).on('error', err => {
    fs.unlink(image.file);
    console.error(`Error downloading ${image.file}:`, err.message);
  });
}
