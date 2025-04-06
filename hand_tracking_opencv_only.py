import cv2
import numpy as np
import time

def detect_skin(frame):
    """Detect skin color in HSV color space"""
    # Convert to HSV
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Define range for skin color in HSV
    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)
    
    # Create a binary mask
    mask = cv2.inRange(hsv, lower_skin, upper_skin)
    
    # Morphological operations to remove noise
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=2)
    mask = cv2.erode(mask, kernel, iterations=1)
    mask = cv2.GaussianBlur(mask, (5, 5), 100)
    
    return mask

def find_contours(mask):
    """Find contours in the mask"""
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    return contours

def find_largest_contour(contours):
    """Find the largest contour, which is likely to be the hand"""
    if not contours:
        return None
    
    return max(contours, key=cv2.contourArea)

def find_convex_hull(contour):
    """Find the convex hull of a contour"""
    if contour is None:
        return None
    
    return cv2.convexHull(contour)

def find_convexity_defects(contour, hull):
    """Find convexity defects which can help identify fingers"""
    if contour is None or hull is None:
        return None
    
    hull_indices = cv2.convexHull(contour, returnPoints=False)
    if len(hull_indices) > 3:
        defects = cv2.convexityDefects(contour, hull_indices)
        return defects
    return None

def draw_hand_features(frame, contour, hull, defects):
    """Draw hand contour, hull, and defects on the frame"""
    if contour is not None:
        cv2.drawContours(frame, [contour], -1, (0, 255, 0), 2)
    
    if hull is not None:
        cv2.drawContours(frame, [hull], -1, (0, 0, 255), 2)
    
    if defects is not None:
        for i in range(defects.shape[0]):
            s, e, f, d = defects[i, 0]
            start = tuple(contour[s][0])
            end = tuple(contour[e][0])
            far = tuple(contour[f][0])
            
            # Draw lines from defect point to start and end points
            cv2.line(frame, start, far, (255, 0, 0), 2)
            cv2.line(frame, end, far, (255, 0, 0), 2)
            
            # Mark the defect point
            cv2.circle(frame, far, 5, (0, 255, 255), -1)
    
    return frame

def count_fingers(defects, contour):
    """Count fingers using convexity defects"""
    if defects is None or contour is None:
        return 0
    
    # Initialize finger count
    finger_count = 1  # Start with 1 for the thumb
    
    for i in range(defects.shape[0]):
        s, e, f, d = defects[i, 0]
        start = tuple(contour[s][0])
        end = tuple(contour[e][0])
        far = tuple(contour[f][0])
        
        # Calculate angle between vectors from far to start and far to end
        a = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
        b = np.sqrt((far[0] - start[0])**2 + (far[1] - start[1])**2)
        c = np.sqrt((end[0] - far[0])**2 + (end[1] - far[1])**2)
        
        # Calculate angle using cosine law
        angle = np.arccos((b**2 + c**2 - a**2) / (2 * b * c)) * 180 / np.pi
        
        # If angle is less than 90 degrees, it's likely a finger
        if angle <= 90:
            finger_count += 1
    
    return min(finger_count, 5)  # Cap at 5 fingers

def main():
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    # FPS calculation variables
    prev_time = 0
    current_time = 0
    
    while True:
        # Read frame from webcam
        success, frame = cap.read()
        if not success:
            print("Error: Failed to read frame from webcam")
            break
        
        # Flip the frame horizontally
        frame = cv2.flip(frame, 1)
        
        # Detect skin
        skin_mask = detect_skin(frame)
        
        # Find contours
        contours = find_contours(skin_mask)
        
        # Find largest contour (likely the hand)
        largest_contour = find_largest_contour(contours)
        
        # Find convex hull
        hull = find_convex_hull(largest_contour)
        
        # Find defects
        defects = find_convexity_defects(largest_contour, hull)
        
        # Draw features on frame
        frame = draw_hand_features(frame, largest_contour, hull, defects)
        
        # Count fingers
        finger_count = count_fingers(defects, largest_contour) if defects is not None else 0
        
        # Display finger count
        cv2.putText(frame, f'Fingers: {finger_count}', (10, 70), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        # Calculate and display FPS
        current_time = time.time()
        fps = 1 / (current_time - prev_time) if (current_time - prev_time) > 0 else 0
        prev_time = current_time
        
        cv2.putText(frame, f'FPS: {int(fps)}', (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Display the original frame and mask
        cv2.imshow("Hand Tracking", frame)
        cv2.imshow("Skin Mask", skin_mask)
        
        # Exit on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Release resources
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main() 