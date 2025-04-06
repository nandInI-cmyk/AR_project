
const https = require('https');
const fs = require('fs');
const path = require('path');

// URL to a publicly available Happy Birthday MP3 (replace with actual URL if needed)
const mp3Url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Placeholder URL
const outputPath = path.join(__dirname, 'happy-birthday-314197.mp3');

console.log('Downloading Happy Birthday audio file...');
console.log(`From: ${mp3Url}`);
console.log(`To: ${outputPath}`);

const file = fs.createWriteStream(outputPath);

https.get(mp3Url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: HTTP status code ${response.statusCode}`);
    fs.unlinkSync(outputPath); // Remove partial file
    return;
  }
  
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('Download completed successfully!');
    console.log(`The audio file is now available at: ${outputPath}`);
    console.log('You can now open index.html in your browser to use the AR Fingerboard Tracking app.');
  });
}).on('error', (err) => {
  fs.unlinkSync(outputPath); // Remove partial file
  console.error(`Error downloading file: ${err.message}`);
}); 