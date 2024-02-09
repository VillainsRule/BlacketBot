let st = Date.now();
let files = 0;

import axios from 'axios';
import fs from 'fs';
import path from 'path';

let blooks = JSON.parse(fs.readFileSync(path.join(__dirname, 'blooks.json'), 'utf-8'));

const imagesFolder = path.join(__dirname, 'scraper');
if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

Object.values(blooks).map(a => a.image).forEach(async (imageUrl) => {
    try {
        const response = await axios.get('https://blacket.org' + imageUrl, { responseType: 'arraybuffer' });
        const imageData = response.data;

        const filename = imageUrl.split('/').pop().toLowerCase();

        fs.writeFileSync(path.join(imagesFolder, filename.endsWith('gif') ? 'animated' : 'static', filename), imageData, 'binary');
        files++;
        console.log(`Image ${filename} saved successfully.`);

        if (files === Object.keys(blooks).length) console.log(`Downloaded ${files} images in ${Date.now() - st}ms.`)
    } catch (error) {
        console.error(`Error saving image from ${imageUrl}:`, error);
    }
});