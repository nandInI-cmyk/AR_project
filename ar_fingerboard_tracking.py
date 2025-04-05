import cv2
import numpy as np
import mediapipe as mp
import time
import os
import pygame
import math

class ARFingerboardTracker:
    def __init__(self):
        # Initialize MediaPipe Hands with improved settings for better detection
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.6,  # Lowered threshold for better detection
            min_tracking_confidence=0.4    # Lowered for better tracking
        )
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Guitar fingerboard parameters (can be adjusted)
        self.num_strings = 6
        self.num_frets = 12
        self.string_positions = None
        self.fret_positions = None
        
        # Note mapping
        self.notes = [
            ['E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3'],
            ['B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3'],
            ['G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4'],
            ['D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4'],
            ['A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3'],
            ['E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3']
        ]
        
        # Common chord shapes (fret positions for each string, -1 means string not played)
        self.chord_shapes = {
            'C Major': [0, 1, 0, 2, 3, -1],
            'G Major': [3, 0, 0, 0, 2, 3],
            'D Major': [-1, -1, 0, 2, 3, 2],
            'A Major': [0, 2, 2, 2, 0, -1],
            'E Major': [0, 0, 1, 2, 2, 0],
            'F Major': [1, 1, 2, 3, 3, 1],
            'A Minor': [0, 1, 2, 2, 0, -1],
            'E Minor': [0, 0, 0, 2, 2, 0],
            'D Minor': [-1, -1, 0, 2, 3, 1],
            'G7': [3, 0, 0, 0, 2, 1]  # Adding G7 for Happy Birthday
        }
        
        # Song chord progressions (example)
        self.songs = {
            "Wonderwall": ["E Minor", "G Major", "D Major", "A Major"],
            "Let It Be": ["C Major", "G Major", "A Minor", "F Major"],
            "Sweet Home Alabama": ["D Major", "C Major", "G Major"],
            "Happy Birthday": ["G Major", "D Major", "C Major", "G7"]  # Simple Happy Birthday progression
        }
        
        # Song audio files
        self.song_files = {
            "Happy Birthday": "happy-birthday-314197.mp3"  # Using local file by default
        }
        
        self.current_song = None
        self.current_chord_idx = 0
        self.last_chord_change = time.time()
        self.chord_display_time = 3.0  # Display each chord for 3 seconds
        
        # Initialize pygame mixer for audio playback
        pygame.mixer.init()
        self.audio_playing = False
        self.current_audio = None
        
        # Debug mode - set to True to print debug information
        self.debug = True
        
        # Finger tracking variables
        self.show_fingertips = True  # Always show fingertip markers
        self.fingertip_history = []  # Keep track of recent fingertip positions for stability
        self.history_length = 5     # Number of frames to keep in history
        
    def calculate_fingerboard(self, frame):
        """Calculate the position of strings and frets in the frame"""
        h, w, _ = frame.shape
        
        # Use fixed size and position values for more consistent display
        # Make the fingerboard very prominent in the center of the frame
        width_padding = int(w * 0.15)  # 15% padding on each side
        height_padding_top = int(h * 0.25)  # 25% padding from top
        height_padding_bottom = int(h * 0.15)  # 15% padding from bottom
        
        # Calculate rectangle coordinates
        top_left = (width_padding, height_padding_top)
        bottom_right = (w - width_padding, h - height_padding_bottom)
        
        # Calculate string positions - ensure we have exactly the right number
        string_gap = (bottom_right[1] - top_left[1]) / (self.num_strings - 1)
        self.string_positions = [int(top_left[1] + i * string_gap) for i in range(self.num_strings)]
        
        # Calculate fret positions - ensure we have exactly the right number
        fret_gap = (bottom_right[0] - top_left[0]) / self.num_frets
        self.fret_positions = [int(top_left[0] + i * fret_gap) for i in range(self.num_frets + 1)]
        
        # Print info about the fingerboard dimensions
        if self.debug:
            print(f"Frame dimensions: {w}x{h}")
            print(f"Fingerboard dimensions: Width={bottom_right[0]-top_left[0]}, Height={bottom_right[1]-top_left[1]}")
            print(f"Fingerboard position: Top-left={top_left}, Bottom-right={bottom_right}")
            print(f"Number of strings: {len(self.string_positions)}")
            print(f"Number of frets: {len(self.fret_positions)-1}")
        
        return top_left, bottom_right
    
    def detect_fingers_on_fingerboard(self, frame, hand_landmarks, fingerboard_rect):
        """Detect which fingers are on which position of the fingerboard"""
        top_left, bottom_right = fingerboard_rect
        finger_positions = []
        
        # Check if the tip of each finger is on the fingerboard
        fingertips = [
            self.mp_hands.HandLandmark.THUMB_TIP,
            self.mp_hands.HandLandmark.INDEX_FINGER_TIP,
            self.mp_hands.HandLandmark.MIDDLE_FINGER_TIP,
            self.mp_hands.HandLandmark.RING_FINGER_TIP,
            self.mp_hands.HandLandmark.PINKY_TIP
        ]
        
        # Add finger names for debugging
        finger_names = ["Thumb", "Index", "Middle", "Ring", "Pinky"]
        
        # Store current detected fingertips
        current_fingertips = []
        
        for i, finger_tip in enumerate(fingertips):
            x = int(hand_landmarks.landmark[finger_tip].x * frame.shape[1])
            y = int(hand_landmarks.landmark[finger_tip].y * frame.shape[0])
            
            # Always draw fingertips if enabled
            if self.show_fingertips:
                # Create a glowing effect for better visibility
                # Outer glow (larger, more transparent)
                cv2.circle(frame, (x, y), 12, (100, 0, 100, 128), -1)
                # Inner circle (smaller, more opaque)
                cv2.circle(frame, (x, y), 8, (255, 0, 150), -1)
                # White border
                cv2.circle(frame, (x, y), 8, (255, 255, 255), 1)
            
            # Store current fingertip position
            current_fingertips.append((finger_tip, x, y, finger_names[i]))
            
            # Expand detection area - accept fingers that are close to the fingerboard
            padding = 25  # increased padding around fingerboard
            if (top_left[0] - padding <= x <= bottom_right[0] + padding and 
                top_left[1] - padding <= y <= bottom_right[1] + padding):
                
                # Find closest string
                string_idx = min(range(len(self.string_positions)), 
                                key=lambda i: abs(self.string_positions[i] - y))
                
                # Find closest fret
                fret_distances = [abs(x - fret_x) for fret_x in self.fret_positions]
                fret_idx = fret_distances.index(min(fret_distances))
                
                # Adjust fret index for open strings (near the nut)
                if x < self.fret_positions[0] + padding:
                    fret_idx = 0
                elif fret_idx > 0:
                    fret_idx -= 1  # Adjust because we want the fret behind the finger
                
                # Ensure we don't go out of bounds
                if fret_idx >= len(self.notes[0]):
                    fret_idx = len(self.notes[0]) - 1
                    
                note = self.notes[string_idx][fret_idx]
                finger_positions.append((finger_tip, string_idx, fret_idx, note, finger_names[i]))
                
                if self.debug and i == 0:  # Only print for the first finger to reduce console spam
                    print(f"Detected {finger_names[i]} finger at string {string_idx+1}, fret {fret_idx}, note {note}")
        
        # Update fingertip history
        self.fingertip_history.append(current_fingertips)
        if len(self.fingertip_history) > self.history_length:
            self.fingertip_history.pop(0)  # Remove oldest entry
        
        return finger_positions
    
    def draw_fingerboard(self, frame, top_left, bottom_right):
        """Draw the AR fingerboard overlay"""
        try:
            # Create a solid background for the fingerboard
            overlay = frame.copy()
            # Use a brown color similar to a real fingerboard with high opacity
            cv2.rectangle(overlay, top_left, bottom_right, (51, 51, 153), -1)  # Brown color
            # Apply very high opacity (80%) to ensure visibility
            cv2.addWeighted(overlay, 0.8, frame, 0.2, 0, frame)  # Apply high opacity
            
            # Add a thick white border around the fingerboard
            cv2.rectangle(frame, top_left, bottom_right, (255, 255, 255), 3)  # Thick white border
            
            # Draw strings with bright color and increased thickness
            for y in self.string_positions:
                cv2.line(frame, (top_left[0], int(y)), (bottom_right[0], int(y)), (0, 255, 255), 5)  # Bright yellow, extra thick
            
            # Draw frets with bright color and increased thickness
            for x in self.fret_positions:
                cv2.line(frame, (int(x), top_left[1]), (int(x), bottom_right[1]), (255, 255, 0), 5)  # Bright yellow, extra thick
            
            # Add fret numbers with larger font and improved visibility
            for i, x in enumerate(self.fret_positions):
                if i > 0:  # Skip the first one (nut)
                    # Draw text with background for better visibility
                    text = str(i)
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    font_scale = 1.0  # Very large font for visibility
                    thickness = 2
                    text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
                    
                    # Position for text
                    text_x = int(x) - text_size[0] // 2
                    text_y = top_left[1] - 10
                    
                    # Draw background rectangle for text
                    cv2.rectangle(frame, 
                                (text_x - 5, text_y - text_size[1] - 5), 
                                (text_x + text_size[0] + 5, text_y + 5), 
                                (0, 0, 0), -1)
                    
                    # Draw text with bright color
                    cv2.putText(frame, text, (text_x, text_y), 
                               font, font_scale, (0, 255, 255), thickness)
            
            # Add large string labels (E, A, D, G, B, E) on the left side
            string_names = ["E", "B", "G", "D", "A", "E"]
            for i, y in enumerate(self.string_positions):
                # Draw string name background
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 1.0  # Larger font
                text = string_names[i]
                text_size = cv2.getTextSize(text, font, font_scale, 2)[0]
                
                # Position text to the left of the fingerboard
                text_x = top_left[0] - text_size[0] - 15
                text_y = int(y) + text_size[1] // 2
                
                # Draw background for string name
                cv2.rectangle(frame,
                            (text_x - 5, text_y - text_size[1] - 5),
                            (text_x + text_size[0] + 5, text_y + 5),
                            (0, 0, 0), -1)
                
                # Draw string name with bright color
                cv2.putText(frame, text, (text_x, text_y),
                          font, font_scale, (255, 255, 0), 2)  # Bright yellow text
            
            # Add a title label "GUITAR FINGERBOARD" at the top
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 1.2
            text = "GUITAR FINGERBOARD"
            text_size = cv2.getTextSize(text, font, font_scale, 3)[0]
            text_x = (top_left[0] + bottom_right[0]) // 2 - text_size[0] // 2
            text_y = top_left[1] - 40
            
            # Draw background for title
            cv2.rectangle(frame,
                        (text_x - 10, text_y - text_size[1] - 10),
                        (text_x + text_size[0] + 10, text_y + 10),
                        (0, 0, 0), -1)
            
            # Draw title with bright color
            cv2.putText(frame, text, (text_x, text_y),
                      font, font_scale, (0, 255, 255), 3)  # Cyan text, very thick
            
            # Draw arrows pointing to the fingerboard (only for the first 300 frames)
            frame_count = getattr(self, 'frame_counter', 0)
            if frame_count < 300:  # Show arrows for first 10 seconds at 30fps
                # Calculate arrow positions (top, bottom, left, right)
                arrow_length = 80
                arrow_thickness = 3
                arrow_color = (0, 255, 0)  # Bright green
                
                # Draw pulsing arrows (change size based on frame count)
                pulse = 5 * abs(math.sin(frame_count / 10))  # Pulsing effect
                
                # Top arrow
                top_arrow_start = (frame.shape[1] // 2, top_left[1] - arrow_length - 20 - int(pulse))
                top_arrow_end = (frame.shape[1] // 2, top_left[1] - 20)
                cv2.arrowedLine(frame, top_arrow_start, top_arrow_end, arrow_color, arrow_thickness, tipLength=0.3)
                
                # Bottom arrow
                bottom_arrow_start = (frame.shape[1] // 2, bottom_right[1] + arrow_length + 20 + int(pulse))
                bottom_arrow_end = (frame.shape[1] // 2, bottom_right[1] + 20)
                cv2.arrowedLine(frame, bottom_arrow_start, bottom_arrow_end, arrow_color, arrow_thickness, tipLength=0.3)
                
                # Left arrow
                left_arrow_start = (top_left[0] - arrow_length - 20 - int(pulse), frame.shape[0] // 2)
                left_arrow_end = (top_left[0] - 20, frame.shape[0] // 2)
                cv2.arrowedLine(frame, left_arrow_start, left_arrow_end, arrow_color, arrow_thickness, tipLength=0.3)
                
                # Right arrow
                right_arrow_start = (bottom_right[0] + arrow_length + 20 + int(pulse), frame.shape[0] // 2)
                right_arrow_end = (bottom_right[0] + 20, frame.shape[0] // 2)
                cv2.arrowedLine(frame, right_arrow_start, right_arrow_end, arrow_color, arrow_thickness, tipLength=0.3)
                
                # Add "THIS IS THE FINGERBOARD" text near arrows
                cv2.putText(frame, "THIS IS THE", (left_arrow_start[0], left_arrow_start[1] - 20), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                cv2.putText(frame, "FINGERBOARD", (left_arrow_start[0], left_arrow_start[1] + 20), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            
            if self.debug:
                print(f"Drew fingerboard with {len(self.string_positions)} strings and {len(self.fret_positions)} frets")
        except Exception as e:
            print(f"Error drawing fingerboard: {e}")
    
    def visualize_notes(self, frame, finger_positions):
        """Visualize the detected notes"""
        for finger_tip, string_idx, fret_idx, note, finger_name in finger_positions:
            try:
                # Make sure we have valid indices
                if fret_idx >= len(self.fret_positions) - 1 or string_idx >= len(self.string_positions):
                    continue
                
                # Find the position to display the note
                x = int((self.fret_positions[fret_idx] + self.fret_positions[fret_idx + 1]) / 2)
                y = int(self.string_positions[string_idx])
                
                # Draw a larger circle at the finger position with a glowing effect
                # First draw a larger circle for glow effect
                cv2.circle(frame, (x, y), 25, (50, 50, 200, 150), -1)  # Base glow, larger
                cv2.circle(frame, (x, y), 18, (100, 100, 255), -1)  # Medium glow, larger
                
                # Then draw the main circle
                cv2.circle(frame, (x, y), 15, (0, 0, 255), -1)  # Main circle - bright red, larger
                
                # Add a white border for better contrast
                cv2.circle(frame, (x, y), 15, (255, 255, 255), 2)  # White border
                
                # Display the note with better visibility
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.9  # Larger font
                text = f"{note} ({finger_name})"
                text_size = cv2.getTextSize(text, font, font_scale, 2)[0]
                
                # Draw background for note text - larger for better visibility
                cv2.rectangle(frame,
                            (x + 10, y - text_size[1] // 2 - 10),
                            (x + text_size[0] + 20, y + text_size[1] // 2 + 10),
                            (0, 0, 0), -1)
                
                # Draw note text
                cv2.putText(frame, text, (x + 15, y + text_size[1] // 2), 
                        font, font_scale, (255, 255, 255), 2)
                
                # Draw a highlight line to show which string is being pressed
                cv2.line(frame, (self.fret_positions[fret_idx], y), (self.fret_positions[fret_idx+1], y), 
                         (255, 0, 0), 5)  # Red highlight line
                
            except Exception as e:
                if self.debug:
                    print(f"Error visualizing note: {e}")
    
    def detect_chord(self, finger_positions):
        """Try to detect which chord is being played"""
        if len(finger_positions) < 3:  # Need at least 3 fingers for a chord
            return None
        
        # Extract the string and fret information
        string_frets = [None] * self.num_strings
        for _, string_idx, fret_idx, _ in finger_positions:
            string_frets[string_idx] = fret_idx
        
        # Compare with known chord shapes
        best_match = None
        best_score = 0
        
        for chord_name, chord_shape in self.chord_shapes.items():
            score = 0
            for i, fret in enumerate(chord_shape):
                if fret == -1:  # String not played in this chord
                    if string_frets[i] is None:
                        score += 1
                elif string_frets[i] is not None and abs(string_frets[i] - fret) <= 1:
                    # Allow some tolerance in fret position
                    score += 1
            
            # Calculate match percentage
            match_percentage = score / self.num_strings
            if match_percentage > 0.7 and match_percentage > best_score:  # 70% threshold
                best_score = match_percentage
                best_match = chord_name
        
        return best_match
    
    def display_chord_guidance(self, frame, fingerboard_rect, chord_name):
        """Display chord guidance on the fingerboard"""
        if chord_name not in self.chord_shapes:
            return
        
        top_left, bottom_right = fingerboard_rect
        chord_shape = self.chord_shapes[chord_name]
        
        # Display chord name with better visibility
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.2  # Larger font
        text = f"Chord: {chord_name}"
        text_size = cv2.getTextSize(text, font, font_scale, 2)[0]
        
        # Position for chord name
        text_x = top_left[0]
        text_y = bottom_right[1] + 40
        
        # Draw background for better visibility
        cv2.rectangle(frame,
                     (text_x - 5, text_y - text_size[1] - 5),
                     (text_x + text_size[0] + 5, text_y + 5),
                     (0, 0, 0), -1)
        
        # Draw chord name
        cv2.putText(frame, text, (text_x, text_y),
                   font, font_scale, (0, 255, 255), 2)
        
        # Draw finger positions for the chord with improved visibility
        for string_idx, fret in enumerate(chord_shape):
            if fret == -1:  # String not played
                continue
                
            # Calculate position
            y = int(self.string_positions[string_idx])
            x = int((self.fret_positions[fret] + self.fret_positions[fret+1]) / 2)
            
            # Draw a circle at the position with improved visibility
            cv2.circle(frame, (x, y), 15, (0, 255, 255), 3)  # Thicker circle
            cv2.circle(frame, (x, y), 16, (0, 0, 0), 1)      # Black outline for contrast
    
    def select_song(self, song_name):
        """Select a song to practice"""
        if song_name in self.songs:
            self.current_song = song_name
            self.current_chord_idx = 0
            self.last_chord_change = time.time()
            
            # Stop any currently playing audio
            self.stop_audio()
            
            # Play the song audio if available
            if song_name in self.song_files and os.path.exists(self.song_files[song_name]):
                try:
                    pygame.mixer.music.load(self.song_files[song_name])
                    pygame.mixer.music.play()
                    self.audio_playing = True
                except Exception as e:
                    print(f"Error playing audio: {e}")
            
            # Check if the song file exists but is not in the directory
            elif song_name == "Happy Birthday" and not os.path.exists(self.song_files[song_name]):
                # Try alternate location (current directory)
                alternate_path = "happy-birthday-314197.mp3"
                if os.path.exists(alternate_path):
                    try:
                        pygame.mixer.music.load(alternate_path)
                        pygame.mixer.music.play()
                        self.audio_playing = True
                        # Update the path for future reference
                        self.song_files["Happy Birthday"] = alternate_path
                    except Exception as e:
                        print(f"Error playing audio from alternate location: {e}")
                        
            return True
        return False
    
    def stop_audio(self):
        """Stop any playing audio"""
        if self.audio_playing and pygame.mixer.music.get_busy():
            pygame.mixer.music.stop()
            self.audio_playing = False
    
    def update_song_progression(self, frame, fingerboard_rect):
        """Update and display the current chord in the song progression"""
        if self.current_song is None:
            return
            
        # Check if it's time to change the chord
        current_time = time.time()
        if current_time - self.last_chord_change > self.chord_display_time:
            self.current_chord_idx = (self.current_chord_idx + 1) % len(self.songs[self.current_song])
            self.last_chord_change = current_time
        
        # Get current chord
        current_chord = self.songs[self.current_song][self.current_chord_idx]
        
        # Display song information with better visibility
        top_left, _ = fingerboard_rect
        
        # Draw song name with background
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.8
        text1 = f"Song: {self.current_song}"
        text_size1 = cv2.getTextSize(text1, font, font_scale, 2)[0]
        
        # Draw background for song name
        cv2.rectangle(frame,
                     (top_left[0] - 5, top_left[1] - 50 - text_size1[1] - 5),
                     (top_left[0] + text_size1[0] + 5, top_left[1] - 50 + 5),
                     (0, 0, 0), -1)
        
        # Draw song name
        cv2.putText(frame, text1, (top_left[0], top_left[1] - 50),
                   font, font_scale, (255, 255, 0), 2)
        
        # Draw current chord with background
        text2 = f"Play: {current_chord}"
        text_size2 = cv2.getTextSize(text2, font, font_scale, 2)[0]
        
        # Draw background for chord
        cv2.rectangle(frame,
                     (top_left[0] - 5, top_left[1] - 20 - text_size2[1] - 5),
                     (top_left[0] + text_size2[0] + 5, top_left[1] - 20 + 5),
                     (0, 0, 0), -1)
        
        # Draw chord text
        cv2.putText(frame, text2, (top_left[0], top_left[1] - 20),
                   font, font_scale, (255, 255, 0), 2)
        
        # Display chord guidance
        self.display_chord_guidance(frame, fingerboard_rect, current_chord)
    
    def run(self):
        print("Starting AR Fingerboard Tracker...")
        print("*" * 50)
        print("FINGERBOARD DISPLAY FIX APPLIED")
        print("The fingerboard should now be clearly visible with:")
        print("- Higher opacity (80%)")
        print("- Brighter colors for strings and frets")
        print("- Thicker lines and clearer labels")
        print("- Fixed positioning in center of screen")
        print("*" * 50)
        
        cap = cv2.VideoCapture(0)
        
        # Check if camera opened successfully
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return
        
        print("Camera opened successfully.")
        
        # Set camera resolution for better visibility
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        
        # Try to increase frame rate for more responsive tracking
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        # Select a default song to practice
        self.select_song("Let It Be")
        
        print("Starting main loop...")
        print("Fingerboard will be displayed with high visibility...")
        frame_count = 0
        self.frame_counter = 0  # Track frame count for the arrow animation
        
        # Display instructions at startup
        print("\nInstructions:")
        print("- Press 'q' to quit")
        print("- Press '1-4' to change songs")
        print("- Move your hands over the virtual fingerboard to play notes")
        print("- Try to match the suggested chord positions\n")
        
        # Flag to show initial overlay
        show_startup_overlay = True
        startup_overlay_frames = 150  # Show for about 5 seconds at 30fps
        
        # Also add a separate fingerboard visibility message
        show_visibility_message = True
        visibility_message_frames = 300  # Show for about 10 seconds
        
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                print("Failed to read from camera.")
                break
            
            # Flip the image horizontally for a more intuitive mirror view
            frame = cv2.flip(frame, 1)
            
            # Convert to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process the image and get hand landmarks with improved parameters
            results = self.hands.process(rgb_frame)
            
            # Calculate fingerboard position
            fingerboard_rect = self.calculate_fingerboard(frame)
            
            # Update frame counter for animations
            self.frame_counter = frame_count
            
            # Draw the virtual fingerboard
            self.draw_fingerboard(frame, *fingerboard_rect)
            
            # Display a very prominent message about fingerboard visibility
            if show_visibility_message and frame_count < visibility_message_frames:
                # Draw a semi-transparent box in the top half of the screen
                overlay = frame.copy()
                cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]//3), (0, 0, 0), -1)
                cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
                
                # Draw attention-grabbing header
                cv2.putText(frame, "FINGERBOARD VISIBILITY FIXED!", 
                          (frame.shape[1]//2 - 300, 50), 
                          cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 3)
                
                # Draw explanation text
                visibility_text = [
                    "The fingerboard has been enhanced with:",
                    "- Increased opacity (80%) to ensure visibility",
                    "- Brighter colors and thicker lines (5px)",
                    "- Larger labels for strings and frets",
                    "- 'GUITAR FINGERBOARD' title for clarity"
                ]
                
                for i, text in enumerate(visibility_text):
                    cv2.putText(frame, text, 
                              (frame.shape[1]//2 - 300, 100 + i*30), 
                              cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                
                # Draw a "Look at the center of screen" message
                if frame_count % 60 < 30:  # Flash every half second
                    cv2.putText(frame, "LOOK AT THE FINGERBOARD IN THE CENTER!", 
                              (frame.shape[1]//2 - 350, frame.shape[0]//3 - 20), 
                              cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
            
            # Update song progression
            self.update_song_progression(frame, fingerboard_rect)
            
            detected_chord = None
            detected_fingers = False
            
            # Show startup overlay with clear instructions about the fingerboard
            if show_startup_overlay and frame_count < startup_overlay_frames:
                # Create semi-transparent overlay
                overlay = frame.copy()
                cv2.rectangle(overlay, (0, 0), (frame.shape[1], frame.shape[0]), (0, 0, 0), -1)
                cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)  # More opaque
                
                # Draw title
                title = "AR Guitar Fingerboard Tracker"
                cv2.putText(frame, title, (frame.shape[1]//2 - 250, 100), 
                          cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 255), 3)
                
                # Draw instructions with better spacing
                instructions = [
                    "The colored rectangle is your virtual guitar fingerboard",
                    "Horizontal lines are strings (E, B, G, D, A, E from top)",
                    "Vertical lines are frets",
                    "Place your fingers over the fingerboard to play notes",
                    "Follow the guided chords for the selected song",
                    "Press '1-4' to change songs, 'q' to quit"
                ]
                
                for i, text in enumerate(instructions):
                    y_pos = 180 + i * 50
                    cv2.putText(frame, text, (frame.shape[1]//2 - 350, y_pos), 
                              cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                
                # Add a prompt to proceed
                if frame_count > startup_overlay_frames - 30:  # Last second
                    cv2.putText(frame, "Starting now...", (frame.shape[1]//2 - 100, frame.shape[0] - 100), 
                              cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                show_startup_overlay = False
            
            # If hands are detected, track fingers on fingerboard
            if results.multi_hand_landmarks:
                detected_fingers = True
                for hand_landmarks in results.multi_hand_landmarks:
                    # Draw hand landmarks with custom style for better visibility
                    drawing_spec = self.mp_drawing.DrawingSpec(color=(0, 255, 255), thickness=4, circle_radius=6)
                    connection_spec = self.mp_drawing.DrawingSpec(color=(255, 255, 0), thickness=2)
                    self.mp_drawing.draw_landmarks(
                        frame, 
                        hand_landmarks, 
                        self.mp_hands.HAND_CONNECTIONS,
                        landmark_drawing_spec=drawing_spec,
                        connection_drawing_spec=connection_spec
                    )
                    
                    # Detect fingers on fingerboard
                    finger_positions = self.detect_fingers_on_fingerboard(
                        frame, hand_landmarks, fingerboard_rect
                    )
                    
                    # Visualize detected notes
                    self.visualize_notes(frame, finger_positions)
                    
                    # Try to detect chord
                    if finger_positions:
                        detected_chord = self.detect_chord(finger_positions)
                        if self.debug and frame_count % 30 == 0:  # Only print every 30 frames to avoid console spam
                            print(f"Fingers detected: {len(finger_positions)}, Chord detected: {detected_chord}")
            
            # Display help message if no hands detected for a while and not showing startup overlay
            elif not detected_fingers and frame_count % 150 == 0 and not show_startup_overlay:
                cv2.putText(frame, "No hands detected - move your hand over the fingerboard", 
                          (30, frame.shape[0] - 60), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 100, 100), 2)
                if self.debug:
                    print("No hands detected")
            
            frame_count += 1
            
            # Display detected chord if any, with improved visibility
            if detected_chord:
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.8
                text = f"Detected: {detected_chord}"
                text_size = cv2.getTextSize(text, font, font_scale, 2)[0]
                
                # Position at bottom of screen
                text_x = 10
                text_y = frame.shape[0] - 20
                
                # Draw background
                cv2.rectangle(frame,
                             (text_x - 5, text_y - text_size[1] - 5),
                             (text_x + text_size[0] + 5, text_y + 5),
                             (0, 0, 0), -1)
                
                # Draw detected chord text
                cv2.putText(frame, text, (text_x, text_y),
                           font, font_scale, (0, 200, 255), 2)
            
            # Display instructions with improved visibility - only if not showing startup overlay
            if not show_startup_overlay:
                # Instructions background
                cv2.rectangle(frame, (5, 5), (300, 70), (0, 0, 0), -1)
                
                # Draw instruction text
                cv2.putText(frame, "Press 'q' to quit", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
                cv2.putText(frame, "Press '1-4' to change song", (10, 60), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            
            # Display the resulting frame
            cv2.imshow('AR Fingerboard Tracking', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('1'):
                self.select_song("Let It Be")
            elif key == ord('2'):
                self.select_song("Wonderwall")
            elif key == ord('3'):
                self.select_song("Sweet Home Alabama")
            elif key == ord('4'):
                self.select_song("Happy Birthday")
        
        # Stop audio before releasing resources
        self.stop_audio()
        
        # Release resources
        cap.release()
        cv2.destroyAllWindows()
        print("AR Fingerboard Tracker stopped.")

if __name__ == "__main__":
    tracker = ARFingerboardTracker()
    tracker.run() 