import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Page.css';

function Support() {
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
          <h1>Support</h1>
          <p>We're here to help you succeed</p>
        </motion.div>

        <motion.div
          className="content-sections"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <section className="doc-section">
            <h2>Quick Links</h2>
            <div className="support-grid">
              <Link to="/documentation" className="support-card">
                <div className="support-icon">📚</div>
                <h3>Documentation</h3>
                <p>Complete guides and tutorials</p>
              </Link>
              <Link to="/api-setup" className="support-card">
                <div className="support-icon">🔑</div>
                <h3>API Setup</h3>
                <p>Get your Gemini API key</p>
              </Link>
              <a href="https://github.com/harsh194/assistant/issues" target="_blank" rel="noopener noreferrer" className="support-card">
                <div className="support-icon">🐛</div>
                <h3>Report a Bug</h3>
                <p>Found an issue? Let us know</p>
              </a>
              <a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer" className="support-card">
                <div className="support-icon">💻</div>
                <h3>GitHub</h3>
                <p>View source code</p>
              </a>
            </div>
          </section>

          <section className="doc-section">
            <h2>Frequently Asked Questions</h2>
            <div className="doc-content">
              <div className="faq-item">
                <h3>Is Assistant free to use?</h3>
                <p>Yes! Assistant is completely free and open-source. You only need to bring your own Google Gemini API key, which has a generous free tier (15 requests/minute, 1M tokens/month).</p>
              </div>

              <div className="faq-item">
                <h3>How is my data handled?</h3>
                <p>Your conversations are processed directly by Google Gemini and stored locally on your device. We don't collect, store, or have access to your conversations or API keys.</p>
              </div>

              <div className="faq-item">
                <h3>What platforms are supported?</h3>
                <p>Assistant works on macOS and Windows. Linux support is planned for a future release.</p>
              </div>

              <div className="faq-item">
                <h3>Can I use this for exams or interviews?</h3>
                <p>Assistant is designed as a learning and practice tool. Please ensure you comply with your organization's policies and ethical guidelines when using AI assistance.</p>
              </div>

              <div className="faq-item">
                <h3>Why do I need my own API key?</h3>
                <p>Using your own API key gives you direct control over your data, usage, and costs. It ensures privacy (your data goes directly to Google, not through our servers) and lets you choose which Gemini model to use.</p>
              </div>

              <div className="faq-item">
                <h3>How do I update the app?</h3>
                <p>New versions are released on GitHub. Download the latest version and install it over your existing installation. Your settings and session history will be preserved.</p>
              </div>

              <div className="faq-item">
                <h3>Can I customize the keyboard shortcuts?</h3>
                <p>Yes! Go to Settings → Keybindings to customize shortcuts to your preference.</p>
              </div>

              <div className="faq-item">
                <h3>Does it work offline?</h3>
                <p>No, Assistant requires an internet connection to communicate with the Gemini API for real-time AI responses.</p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2>Contact</h2>
            <div className="doc-content">
              <p>For support, feature requests, or general questions:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Email:</strong>
                  <a href="mailto:harshranjan194@gmail.com">harshranjan194@gmail.com</a>
                </div>
                <div className="contact-item">
                  <strong>GitHub Issues:</strong>
                  <a href="https://github.com/harsh194/assistant/issues" target="_blank" rel="noopener noreferrer">github.com/harsh194/assistant/issues</a>
                </div>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2>Contributing</h2>
            <div className="doc-content">
              <p>Assistant is open-source and we welcome contributions!</p>
              <ul>
                <li>Report bugs and request features on GitHub</li>
                <li>Submit pull requests to improve the codebase</li>
                <li>Help improve documentation</li>
                <li>Share your use cases and feedback</li>
              </ul>
              <p>Visit our <a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer">GitHub repository</a> to get started.</p>
            </div>
          </section>
        </motion.div>
      </div>

      <footer className="page-footer">
        <p>Can't find what you're looking for? <a href="mailto:harshranjan194@gmail.com">Email us</a></p>
      </footer>
    </div>
  );
}

export default Support;
