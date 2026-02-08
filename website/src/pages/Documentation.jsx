import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Page.css';

function Documentation() {
  return (
    <div className="page-container">
      <nav className="page-nav">
        <div className="nav-content">
          <Link to="/" className="logo">Assistant</Link>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </nav>

      <div className="page-content">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Documentation</h1>
          <p>Everything you need to get started with Assistant</p>
        </motion.div>

        <motion.div
          className="content-sections"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <section className="doc-section">
            <h2>Getting Started</h2>
            <div className="doc-content">
              <h3>Installation</h3>
              <ol>
                <li>Download the app for your operating system (macOS or Windows)</li>
                <li>Install the application by following the on-screen instructions</li>
                <li>Launch Assistant from your Applications folder or Start menu</li>
              </ol>

              <h3>First Time Setup</h3>
              <p>When you first launch Assistant, you'll be guided through the onboarding process:</p>
              <ol>
                <li><strong>API Key Configuration:</strong> Enter your Google Gemini API key</li>
                <li><strong>Permissions:</strong> Grant microphone and screen recording permissions</li>
                <li><strong>Profile Selection:</strong> Choose your primary use case (Interview, Sales, Meeting, etc.)</li>
              </ol>
            </div>
          </section>

          <section className="doc-section">
            <h2>Features</h2>
            <div className="doc-content">
              <h3>Real-time AI Assistance</h3>
              <p>Get instant, contextual suggestions during conversations. The AI analyzes:</p>
              <ul>
                <li>Audio from your microphone and system audio</li>
                <li>Visual content from screen captures</li>
                <li>Context from your selected profile</li>
              </ul>

              <h3>Screen Analysis</h3>
              <p>Capture and analyze your screen to get context-aware help:</p>
              <ul>
                <li>Click the camera icon or use the keyboard shortcut</li>
                <li>The AI analyzes code, documents, presentations, etc.</li>
                <li>Receive structured guidance based on visual context</li>
              </ul>

              <h3>Session Management</h3>
              <p>All your conversations are saved locally:</p>
              <ul>
                <li>Access conversation history anytime</li>
                <li>Search through past sessions</li>
                <li>Export sessions for future reference</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Keyboard Shortcuts</h2>
            <div className="doc-content">
              <table className="shortcuts-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Move Window</td>
                    <td><kbd>Ctrl/Cmd</kbd> + <kbd>Arrow Keys</kbd></td>
                  </tr>
                  <tr>
                    <td>Toggle Click-through</td>
                    <td><kbd>Ctrl/Cmd</kbd> + <kbd>M</kbd></td>
                  </tr>
                  <tr>
                    <td>Close / Back</td>
                    <td><kbd>Ctrl/Cmd</kbd> + <kbd>\</kbd></td>
                  </tr>
                  <tr>
                    <td>Send Message</td>
                    <td><kbd>Enter</kbd></td>
                  </tr>
                  <tr>
                    <td>Capture Screen</td>
                    <td><kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="doc-section">
            <h2>Profiles</h2>
            <div className="doc-content">
              <p>Assistant adapts its guidance based on your selected profile:</p>

              <h3>Interview Profile</h3>
              <p>Optimized for job interviews with structured response frameworks and behavioral question guidance.</p>

              <h3>Sales Call Profile</h3>
              <p>Helps you handle objections, identify buying signals, and close deals effectively.</p>

              <h3>Meeting Profile</h3>
              <p>Keeps meetings on track with agenda suggestions and action item tracking.</p>

              <h3>Presentation Profile</h3>
              <p>Provides speaker notes and helps you stay structured during presentations.</p>

              <h3>Negotiation Profile</h3>
              <p>Offers strategic response suggestions for high-stakes negotiations.</p>

              <h3>Exam Profile</h3>
              <p>Provides instant explanations and problem-solving guidance.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Troubleshooting</h2>
            <div className="doc-content">
              <h3>AI Not Responding</h3>
              <ul>
                <li>Check your internet connection</li>
                <li>Verify your Gemini API key is valid</li>
                <li>Ensure you have API credits available</li>
              </ul>

              <h3>Microphone Not Working</h3>
              <ul>
                <li>Grant microphone permissions in system settings</li>
                <li>Check that the correct microphone is selected in app settings</li>
                <li>Restart the application</li>
              </ul>

              <h3>Screen Capture Failing</h3>
              <ul>
                <li>Grant screen recording permissions in system settings</li>
                <li>On macOS: System Settings → Privacy & Security → Screen Recording</li>
                <li>On Windows: Check app permissions in Windows Settings</li>
              </ul>
            </div>
          </section>
        </motion.div>
      </div>

      <footer className="page-footer">
        <p>Need more help? <Link to="/support">Contact Support</Link></p>
      </footer>
    </div>
  );
}

export default Documentation;
