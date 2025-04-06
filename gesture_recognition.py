import cv2
import mediapipe as mp
import numpy as np
import math

class HandGestureRecognizer:
    def __init__(self):
        # Initialize MediaPipe Hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Gesture mappings
        self.gestures = {
            "fist": "Closed fist",
            "palm": "Open palm",
            "pinch": "Pinch gesture",
            "pointing": "Pointing",
            "victory": "Victory sign"
        }
        
    def recognize_gesture(self, hand_landmarks):
        """Recognize hand gesture based on finger positions"""
        # Get finger landmarks
        landmarks = []
        for lm in hand_landmarks.landmark:
            landmarks.append((lm.x, lm.y, lm.z))
        
        # Check if fingers are extended
        thumb_extended = self._is_thumb_extended(landmarks)
        index_extended = self._is_finger_extended(landmarks, 8, 6, 5)
        middle_extended = self._is_finger_extended(landmarks, 12, 10, 9)
        ring_extended = self._is_finger_extended(landmarks, 16, 14, 13)
        pinky_extended = self._is_finger_extended(landmarks, 20, 18, 17)
        
        # Determine gesture
        if not any([thumb_extended, index_extended, middle_extended, ring_extended, pinky_extended]):
            return "fist"
        elif all([thumb_extended, index_extended, middle_extended, ring_extended, pinky_extended]):
            return "palm"
        elif index_extended and not middle_extended and not ring_extended and not pinky_extended:
            return "pointing"
        elif index_extended and middle_extended and not ring_extended and not pinky_extended:
            return "victory"
        elif thumb_extended and index_extended and self._calculate_distance(landmarks[4], landmarks[8]) < 0.05:
            return "pinch"
        else:
            return "unknown"
    
    def _is_thumb_extended(self, landmarks):
        """Check if thumb is extended based on angles"""
        point1 = np.array([landmarks[4][0], landmarks[4][1]])
        point2 = np.array([landmarks[3][0], landmarks[3][1]])
        point3 = np.array([landmarks[2][0], landmarks[2][1]])
        
        angle = self._calculate_angle(point1, point2, point3)
        return angle > 150
    
    def _is_finger_extended(self, landmarks, tip_idx, mid_idx, base_idx):
        """Check if a finger is extended by comparing y coordinates"""
        return landmarks[tip_idx][1] < landmarks[mid_idx][1] < landmarks[base_idx][1]
    
    def _calculate_angle(self, point1, point2, point3):
        """Calculate angle between three points in degrees"""
        vector1 = point1 - point2
        vector2 = point3 - point2
        
        dot_product = np.dot(vector1, vector2)
        magnitude1 = np.linalg.norm(vector1)
        magnitude2 = np.linalg.norm(vector2)
        
        cos_angle = dot_product / (magnitude1 * magnitude2)
        cos_angle = np.clip(cos_angle, -1.0, 1.0)  # Ensure value is within domain of arccos
        
        angle_rad = np.arccos(cos_angle)
        angle_deg = np.degrees(angle_rad)
        
        return angle_deg
    
    def _calculate_distance(self, point1, point2):
        """Calculate Euclidean distance between two 3D points"""
        return math.sqrt((point1[0] - point2[0])**2 + 
                         (point1[1] - point2[1])**2 + 
                         (point1[2] - point2[2])**2)
    
    def process_frame(self, frame):
        """Process a video frame and recognize gestures"""
        # Flip the image horizontally for a selfie-view display
        frame = cv2.flip(frame, 1)
        
        # Convert the BGR image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the image and find hands
        results = self.hands.process(rgb_frame)
        
        # Draw hand landmarks and recognize gestures
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Draw hand landmarks
                self.mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS,
                    self.mp_drawing_styles.get_default_hand_landmarks_style(),
                    self.mp_drawing_styles.get_default_hand_connections_style()
                )
                
                # Recognize gesture
                gesture = self.recognize_gesture(hand_landmarks)
                gesture_name = self.gestures.get(gesture, "Unknown gesture")
                
                # Display gesture name
                wrist_landmark = hand_landmarks.landmark[0]
                h, w, _ = frame.shape
                cx, cy = int(wrist_landmark.x * w), int(wrist_landmark.y * h)
                cv2.putText(frame, gesture_name, (cx-60, cy-30), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                
        return frame

def main():
    # Initialize the gesture recognizer
    recognizer = HandGestureRecognizer()
    
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    while True:
        # Read frame from webcam
        success, frame = cap.read()
        if not success:
            print("Error: Failed to read frame from webcam")
            break
        
        # Process the frame
        processed_frame = recognizer.process_frame(frame)
        
        # Display the resulting frame
        cv2.imshow('Hand Gesture Recognition', processed_frame)
        
        # Exit on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Release resources
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main() 