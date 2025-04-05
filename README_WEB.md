# Web-Based AR Fingerboard Tracking

This is a browser-based version of the AR Fingerboard Tracking project that uses OpenCV.js instead of Python. This makes it easier to run without installing Python and its dependencies.

## How to Run the Web Version

### Option 1: Direct Method (Easiest)

1. Download all the files in this directory to your computer
2. Double-click on the `index.html` file to open it in your web browser
3. Allow camera access when prompted
4. Click the "Start Camera" button
5. Select a song to practice

### Option 2: Using Node.js for audio file (Better audio support)

If you want to use the Happy Birthday audio feature:

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Open a command prompt or terminal in this directory
3. Run the audio download script:
   ```
   node download_audio.js
   ```
4. This will download the Happy Birthday MP3 to the current directory
5. Open the `index.html` file in your browser

### Option 3: Using a local web server

For best results, especially with audio:

1. Install a simple web server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
2. Open this folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The application will open in your default browser

## Features

- Browser-based AR fingerboard tracking
- No Python installation required
- Works on most devices with a webcam
- Virtual fingerboard overlay
- Chord progression visualization for different songs
- Audio playback for Happy Birthday song

## Controls

- Click "Start Camera" to begin
- Select a song using the buttons
- Follow the highlighted finger positions
- Click "Stop" when finished

## Troubleshooting

- **Camera access denied**: Make sure to grant camera permissions in your browser
- **OpenCV.js loading slowly**: Wait until the "OpenCV.js is ready!" message appears
- **Audio not playing**: Try using a local web server (Option 3) for better audio support
- **Performance issues**: Close other browser tabs and applications to free up resources

## Technical Notes

This application uses:
- OpenCV.js for image processing
- HTML5 webcam access via getUserMedia
- JavaScript for fingerboard visualization
- HTML5 audio for song playback

## Copying Your Happy Birthday MP3

If you already have the Happy Birthday MP3 file at `C:\Users\priya agrawal\Downloads\happy-birthday-314197.mp3`, you can manually copy it to the same directory as the `index.html` file and rename it to `happy-birthday-314197.mp3` to use your existing file.

## Browser Compatibility

This application works best in:
- Google Chrome
- Microsoft Edge
- Firefox
- Safari (on macOS/iOS) 