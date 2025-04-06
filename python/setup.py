import subprocess
import sys
import os

def check_python_version():
    """Check if Python version is 3.7 or higher"""
    major, minor = sys.version_info[:2]
    if major < 3 or (major == 3 and minor < 7):
        print(f"Error: Python 3.7 or higher is required. You have {major}.{minor}.")
        return False
    return True

def install_dependencies():
    """Install required dependencies"""
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencies installed successfully.")
        return True
    except subprocess.CalledProcessError:
        print("Error installing dependencies. Please try manually:")
        print("pip install -r requirements.txt")
        return False
    
def run_application():
    """Run the AR fingerboard tracking application"""
    print("Launching AR Fingerboard Tracking application...")
    try:
        subprocess.call([sys.executable, "ar_fingerboard_tracking.py"])
    except Exception as e:
        print(f"Error launching application: {e}")

def main():
    print("===== AR Fingerboard Tracking Setup =====")
    
    # Check Python version
    if not check_python_version():
        input("Press Enter to exit...")
        return
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("Error: requirements.txt not found.")
        input("Press Enter to exit...")
        return
    
    # Install dependencies
    if not install_dependencies():
        input("Press Enter to exit...")
        return
    
    # Run the application
    print("\nSetup complete! Running the application now.")
    print("(You can run it directly next time with 'python ar_fingerboard_tracking.py')")
    input("Press Enter to launch the application...")
    
    run_application()

if __name__ == "__main__":
    main() 