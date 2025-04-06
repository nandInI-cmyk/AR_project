# Hand Tracking Project

A hand tracking application using computer vision techniques.

## Setup

1. Install Python 3.8 or newer if not already installed.

2. Install the required packages:
   ```
   python -m pip install -r requirements.txt
   ```

## Project Versions

This project has two versions:

### 1. Basic Version (OpenCV Only)
Uses only OpenCV for hand tracking through skin color detection and contour analysis.

Run with:
```
python hand_tracking_opencv_only.py
```

Features:
- Skin color detection
- Hand contour visualization
- Finger counting using contour analysis
- FPS counter

### 2. Advanced Version (Requires MediaPipe)
Uses MediaPipe for more accurate hand landmark detection (requires Python 3.7-3.11).

Run with:
```
python hand_tracking.py
```
or
```
python gesture_recognition.py
```

Features:
- Precise hand landmark detection
- Fingertip highlighting
- Gesture recognition (in gesture_recognition.py)
- FPS counter

## Note on Compatibility

MediaPipe may not be compatible with Python 3.12+ at this time. If you have Python 3.12 or newer, use the basic OpenCV-only version.

If you want to use the advanced version with MediaPipe, consider installing Python 3.10 or 3.11 in a virtual environment.

## Usage

- Press 'q' to quit any of the applications 