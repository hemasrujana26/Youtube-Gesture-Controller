import { motion } from 'framer-motion';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeSnippets = {
  setup: `# Install required packages
pip install opencv-python mediapipe pyautogui

# Clone the repository
git clone https://github.com/yourusername/youtube-gesture-controller.git
cd youtube-gesture-controller

# Run the application
python src/main.py`,

  main: `import cv2
import mediapipe as mp
import pyautogui
import time

class GestureController:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands()
        self.last_action_time = 0
        self.cooldown = 1.0  # seconds

    def process_gesture(self, landmarks):
        # Implement gesture recognition logic
        if self.is_play_gesture(landmarks):
            pyautogui.press('space')
        elif self.is_pause_gesture(landmarks):
            pyautogui.press('space')
        # Add more gesture handlers

    def run(self):
        cap = cv2.VideoCapture(0)
        while cap.isOpened():
            success, image = cap.read()
            if not success:
                continue

            # Process frame and detect gestures
            results = self.hands.process(image)
            if results.multi_hand_landmarks:
                self.process_gesture(results.multi_hand_landmarks[0])

            # Display the frame
            cv2.imshow('Gesture Controller', image)
            if cv2.waitKey(5) & 0xFF == 27:
                break

        cap.release()
        cv2.destroyAllWindows()`,
};

export default function Documentation() {
  return (
    <div id="docs" className="bg-white py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Documentation</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Technical Implementation
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Learn how to set up and use the YouTube Gesture Controller in your own projects.
            Detailed documentation and code examples included.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Setup Instructions</h3>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                {/* <SyntaxHighlighter language="bash" style={tomorrow}>
                  {codeSnippets.setup}
                </SyntaxHighlighter> */}
                <pre style={{whiteSpace: 'pre-wrap'}}>{codeSnippets.setup}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Core Implementation</h3>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                {/* <SyntaxHighlighter language="python" style={tomorrow}>
                  {codeSnippets.main}
                </SyntaxHighlighter> */}
                <pre style={{whiteSpace: 'pre-wrap'}}>{codeSnippets.main}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Future Roadmap</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                <li>Swipe gesture detection for more intuitive navigation</li>
                <li>Custom gesture training module for personalized controls</li>
                <li>Chrome Extension for direct browser-level control</li>
                <li>Support for multiple hand tracking</li>
                <li>Gesture sensitivity customization</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 