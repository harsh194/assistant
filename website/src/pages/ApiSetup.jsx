import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Page.css';

function ApiSetup() {
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
          <h1>API Key Setup</h1>
          <p>Get your Google Gemini API key in minutes</p>
        </motion.div>

        <motion.div
          className="content-sections"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <section className="doc-section">
            <h2>Why Do I Need an API Key?</h2>
            <div className="doc-content">
              <p>Assistant uses Google's Gemini AI to provide real-time assistance. To use the app, you need your own Gemini API key. This approach gives you:</p>
              <ul>
                <li><strong>Privacy:</strong> Your conversations go directly to Google, not through our servers</li>
                <li><strong>Control:</strong> You manage your own usage and costs</li>
                <li><strong>Flexibility:</strong> Choose the Gemini model that fits your needs</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Step-by-Step Guide</h2>
            <div className="doc-content">
              <div className="setup-step">
                <h3>Step 1: Go to Google AI Studio</h3>
                <p>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="external-link">Google AI Studio</a> and sign in with your Google account.</p>
              </div>

              <div className="setup-step">
                <h3>Step 2: Create an API Key</h3>
                <ol>
                  <li>Click on "Get API Key" or "Create API Key"</li>
                  <li>Select "Create API key in new project" (or choose an existing project)</li>
                  <li>Your API key will be generated instantly</li>
                </ol>
                <div className="info-box">
                  <strong>Important:</strong> Copy your API key immediately and store it securely. You won't be able to see it again.
                </div>
              </div>

              <div className="setup-step">
                <h3>Step 3: Add API Key to Assistant</h3>
                <ol>
                  <li>Open the Assistant app</li>
                  <li>On first launch, you'll see the API key input screen</li>
                  <li>Paste your API key and click "Save"</li>
                  <li>If you need to update it later, go to Settings → API Configuration</li>
                </ol>
              </div>

              <div className="setup-step">
                <h3>Step 4: Verify It Works</h3>
                <p>Start a new session and ask the AI a test question. If you see a response, you're all set!</p>
              </div>
            </div>
          </section>

          <section className="doc-section">
            <h2>Pricing & Usage</h2>
            <div className="doc-content">
              <h3>Google Gemini Pricing</h3>
              <p>Gemini offers a generous free tier:</p>
              <ul>
                <li><strong>Free Tier:</strong> 15 requests per minute, 1 million tokens per month</li>
                <li><strong>Paid Tier:</strong> Higher rate limits for heavy users</li>
              </ul>

              <p>For most users, the free tier is more than enough for daily use.</p>

              <h3>Monitor Your Usage</h3>
              <p>You can track your API usage in the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="external-link">Google Cloud Console</a>.</p>
            </div>
          </section>

          <section className="doc-section">
            <h2>Security Best Practices</h2>
            <div className="doc-content">
              <ul>
                <li><strong>Never share your API key</strong> with anyone</li>
                <li><strong>Don't commit API keys</strong> to version control or share in screenshots</li>
                <li><strong>Rotate your keys</strong> periodically for security</li>
                <li><strong>Set usage limits</strong> in Google Cloud Console to prevent unexpected charges</li>
                <li><strong>Use API key restrictions</strong> to limit where the key can be used</li>
              </ul>
            </div>
          </section>

          <section className="doc-section">
            <h2>Troubleshooting</h2>
            <div className="doc-content">
              <h3>Invalid API Key Error</h3>
              <ul>
                <li>Make sure you copied the entire key without spaces</li>
                <li>Verify the key is from Google AI Studio, not another Google service</li>
                <li>Check that the API key hasn't been revoked</li>
              </ul>

              <h3>Rate Limit Exceeded</h3>
              <ul>
                <li>You've hit the free tier limit (15 requests/minute)</li>
                <li>Wait a minute and try again</li>
                <li>Consider upgrading to a paid tier for higher limits</li>
              </ul>

              <h3>Quota Exceeded</h3>
              <ul>
                <li>You've used your monthly token allocation</li>
                <li>Wait until next month for quota reset</li>
                <li>Or enable billing in Google Cloud Console</li>
              </ul>
            </div>
          </section>
        </motion.div>
      </div>

      <footer className="page-footer">
        <p>Still having issues? <Link to="/support">Contact Support</Link></p>
      </footer>
    </div>
  );
}

export default ApiSetup;
