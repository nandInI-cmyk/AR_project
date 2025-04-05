# AR Fingerboard Tracking

This project implements an Augmented Reality (AR) guitar fingerboard tracking system using OpenCV and MediaPipe. It detects hand positions over a virtual guitar fingerboard and maps them to musical notes and chords, helping users learn to play songs.

## Features

- Real-time hand tracking using MediaPipe Hands
- Virtual fingerboard overlay on camera feed
- Detection of finger positions on strings and frets
- Mapping of finger positions to musical notes
- Chord detection and recognition
- Song learning with chord progressions
- Visual guidance for chord positions
- Audio playback integration for song reference

## Included Songs

- "Let It Be" by The Beatles
- "Wonderwall" by Oasis
- "Sweet Home Alabama" by Lynyrd Skynyrd
- "Happy Birthday" with audio playback

## Requirements

- Python 3.7+
- OpenCV
- NumPy
- MediaPipe
- PyGame (for audio playback)
- Webcam

## Detailed Setup Instructions

### Installation

1. **Clone or download the repository**
   Download all project files to your local system.

2. **Make sure you have Python 3.7 or higher installed**
   You can check your Python version by running:
   ```
   python --version
   ```

3. **Install dependencies using the setup script**
   The easiest way to install all required dependencies is to run:
   ```
   python setup.py
   ```
   This will automatically check your Python version, install all required packages, and launch the application.

   Alternatively, you can manually install the dependencies:
   ```
   pip install -r requirements.txt
   ```

4. **Make sure your webcam is connected and working properly**
   The application requires camera access to detect hand positions.

### Running the Application

You can run the application in two ways:

1. **Using the setup script (recommended for first time):**
   ```
   python setup.py
   ```

2. **Running the main script directly:**
   ```
   python ar_fingerboard_tracking.py
   ```

### Audio Setup

The Happy Birthday song requires the audio file to be placed at this specific location:
```
C:\Users\priya agrawal\Downloads\happy-birthday-314197.mp3
```

If the file is not found at this location, the application will still work, but without audio playback.

## Controls

- Press 'q' to exit the application
- Press '1' to practice "Let It Be"
- Press '2' to practice "Wonderwall" 
- Press '3' to practice "Sweet Home Alabama"
- Press '4' to practice "Happy Birthday" (with audio if file is available)

## Usage Guide

1. **Position yourself in front of your webcam**
   Make sure you are in a well-lit environment for best hand detection.

2. **Select a song using the number keys**
   The application will guide you through the chords of the selected song.

3. **Hold your hand in the virtual fingerboard area**
   Keep your hand visible to the camera in the green fingerboard area.

4. **Follow the chord guidance**
   - Yellow circles show where you should place your fingers for the current chord
   - The app will automatically progress through the chords
   - If Happy Birthday is selected, the audio will play along

5. **Practice each chord shape**
   Try to match your finger positions with the highlighted positions on the virtual fingerboard.

6. **Watch for chord detection feedback**
   When you correctly form a chord, the application will show "Detected: [Chord Name]" at the bottom of the screen.

## Troubleshooting

- **Camera not working**: Make sure your webcam is properly connected and not being used by another application
- **Audio not playing**: Verify that the audio file exists at the specified path
- **Poor hand detection**: Improve lighting conditions and keep your hand clearly visible to the camera
- **Slow performance**: Close other applications to free up system resources

## Future Improvements

- Detect actual guitar fingerboard instead of using a virtual overlay
- Add sound generation for the detected notes and chords
- Implement more advanced song learning features with timing guidance
- Add difficulty levels for beginners to advanced players
- Support more instruments like ukulele, bass, etc. 