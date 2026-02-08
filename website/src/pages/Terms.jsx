import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Page.css';

function Terms() {
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
          <h1>Terms of Service</h1>
          <p>Last updated: February 8, 2026</p>
        </motion.div>

        <motion.div
          className="content-sections legal-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <section className="doc-section">
            <h2>Acceptance of Terms</h2>
            <div className="doc-content">
              <p>By downloading, installing, or using Assistant ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the App.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>License</h2>
            <div className="doc-content">
              <p>Assistant is open-source software licensed under the MIT License. You are free to:</p>
              <ul>
                <li>Use the App for any purpose</li>
                <li>Modify the source code</li>
                <li>Distribute copies of the App</li>
                <li>Distribute modified versions</li>
              </ul>
              <p>See the full license at <a href="https://github.com/harsh194/assistant/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">github.com/harsh194/assistant</a></p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Your Responsibilities</h2>
            <div className="doc-content">
              <h3>API Key Management</h3>
              <p>You are responsible for:</p>
              <ul>
                <li>Obtaining and maintaining your own Google Gemini API key</li>
                <li>All costs associated with API usage</li>
                <li>Keeping your API key secure and confidential</li>
                <li>Complying with Google's terms of service for the Gemini API</li>
              </ul>

              <h3>Appropriate Use</h3>
              <p>You agree to use the App:</p>
              <ul>
                <li>In compliance with all applicable laws and regulations</li>
                <li>In compliance with your organization's policies</li>
                <li>Ethically and responsibly</li>
                <li>Not to violate others' rights or privacy</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Disclaimer of Warranties</h2>
            <div className="doc-content">
              <p><strong>THE APP IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.</strong></p>
              <p>We make no warranties, express or implied, including but not limited to:</p>
              <ul>
                <li>Fitness for a particular purpose</li>
                <li>Accuracy or reliability of AI-generated content</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Security or privacy of data</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Limitation of Liability</h2>
            <div className="doc-content">
              <p>To the maximum extent permitted by law:</p>
              <ul>
                <li>We are not liable for any damages arising from your use of the App</li>
                <li>We are not responsible for costs incurred from API usage</li>
                <li>We are not liable for decisions made based on AI-generated suggestions</li>
                <li>You use the App at your own risk</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>AI-Generated Content</h2>
            <div className="doc-content">
              <p>Important disclaimers about AI assistance:</p>
              <ul>
                <li><strong>Not Professional Advice:</strong> The App does not provide legal, medical, financial, or other professional advice</li>
                <li><strong>Accuracy:</strong> AI responses may contain errors, inaccuracies, or outdated information</li>
                <li><strong>Verification:</strong> Always verify important information independently</li>
                <li><strong>Judgment:</strong> Use your own judgment when making decisions</li>
                <li><strong>Context:</strong> AI suggestions are context-dependent and may not fit all situations</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Privacy</h2>
            <div className="doc-content">
              <p>Your use of the App is subject to our <Link to="/privacy">Privacy Policy</Link>. By using the App, you consent to our privacy practices.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Third-Party Services</h2>
            <div className="doc-content">
              <p>The App integrates with Google Gemini API. Your use of this service is subject to:</p>
              <ul>
                <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google Terms of Service</a></li>
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              </ul>
              <p>We are not responsible for Google's services or policies.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Modifications</h2>
            <div className="doc-content">
              <p>We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Academic and Professional Integrity</h2>
            <div className="doc-content">
              <p>If using the App for exams, interviews, or professional situations:</p>
              <ul>
                <li>Ensure compliance with applicable rules and policies</li>
                <li>Be aware of restrictions on AI assistance in your context</li>
                <li>Use ethically and transparently</li>
                <li>You are solely responsible for consequences of use</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Termination</h2>
            <div className="doc-content">
              <p>You may stop using the App at any time by uninstalling it. These Terms remain in effect for past use of the App.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Governing Law</h2>
            <div className="doc-content">
              <p>These Terms are governed by the laws of the jurisdiction where the developer resides, without regard to conflict of law principles.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Contact</h2>
            <div className="doc-content">
              <p>For questions about these Terms, contact us:</p>
              <p><strong>Email:</strong> <a href="mailto:harshranjan194@gmail.com">harshranjan194@gmail.com</a></p>
              <p><strong>GitHub:</strong> <a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer">github.com/harsh194/assistant</a></p>
            </div>
          </section>
        </motion.div>
      </div>

      <footer className="page-footer">
        <p>Read our <Link to="/privacy">Privacy Policy</Link></p>
      </footer>
    </div>
  );
}

export default Terms;
