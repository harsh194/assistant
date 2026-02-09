import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Page.css';

function Privacy() {
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
          <h1>Privacy Policy</h1>
          <p>Last updated: February 8, 2026</p>
        </motion.div>

        <motion.div
          className="content-sections legal-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <section className="doc-section">
            <h2>Overview</h2>
            <div className="doc-content">
              <p>Assistant is designed with privacy as a core principle. This Privacy Policy explains how we handle your information when you use our application.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Information We Don't Collect</h2>
            <div className="doc-content">
              <p><strong>We do not collect, store, or have access to:</strong></p>
              <ul>
                <li>Your conversations or chat history</li>
                <li>Your Google Gemini API keys</li>
                <li>Screen captures or audio recordings</li>
                <li>Personal information or user accounts</li>
                <li>Usage analytics or telemetry data</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Local Data Storage</h2>
            <div className="doc-content">
              <p>All data is stored locally on your device:</p>
              <ul>
                <li><strong>API Keys:</strong> Stored securely in your local system keychain or encrypted storage</li>
                <li><strong>Session History:</strong> Saved in local JSON files in your user data directory</li>
                <li><strong>Settings:</strong> Stored locally in configuration files</li>
                <li><strong>Screen Captures:</strong> Processed in memory and sent directly to Google Gemini (not stored locally unless you explicitly save them)</li>
              </ul>
              <p>You have full control over this data and can delete it at any time by clearing the app data or uninstalling.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Third-Party Services</h2>
            <div className="doc-content">
              <h3>Google Gemini API</h3>
              <p>When you use Assistant, your conversations, screen captures, and audio are sent directly to Google's Gemini API using your own API key. This data is subject to Google's privacy policy and terms of service:</p>
              <ul>
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google Terms of Service</a></li>
              </ul>
              <p>We do not act as an intermediary—your data goes directly from your device to Google.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Permissions</h2>
            <div className="doc-content">
              <p>Assistant requires the following system permissions:</p>
              <ul>
                <li><strong>Microphone Access:</strong> To capture audio for real-time transcription and analysis</li>
                <li><strong>Screen Recording:</strong> To capture screen content for visual context analysis</li>
              </ul>
              <p>These permissions are used solely for the app's core functionality. Audio and screen data are processed in real-time and sent directly to the Gemini API.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Data Security</h2>
            <div className="doc-content">
              <p>We implement industry-standard security practices:</p>
              <ul>
                <li>API keys are stored using your operating system's secure storage (Keychain on macOS, Credential Manager on Windows)</li>
                <li>All communication with Google Gemini uses HTTPS encryption</li>
                <li>No data is transmitted to our servers or third parties (except Google Gemini)</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Open Source</h2>
            <div className="doc-content">
              <p>Assistant is open-source software. You can review our code to verify our privacy claims:</p>
              <p><a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer">github.com/harsh194/assistant</a></p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Children's Privacy</h2>
            <div className="doc-content">
              <p>Assistant is not directed at children under 13. We do not knowingly collect information from children. If you are a parent or guardian and believe your child has used the app, please contact us.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Changes to This Policy</h2>
            <div className="doc-content">
              <p>We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this policy.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Contact</h2>
            <div className="doc-content">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <p><strong>Email:</strong> <a href="mailto:harshranjan194@gmail.com">harshranjan194@gmail.com</a></p>
            </div>
          </section>
        </motion.div>
      </div>

      <footer className="page-footer">
        <p>Read our <Link to="/terms">Terms of Service</Link></p>
      </footer>
    </div>
  );
}

export default Privacy;
