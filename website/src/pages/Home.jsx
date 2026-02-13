import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="app" ref={containerRef}>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <div className="logo">Assistant</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#profiles">Profiles</a>
            <a href="#download">Download</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="hero"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-particles" />
        </div>
        <div className="hero-content">
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Real-Time AI Guidance
          </motion.div>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Say The Right Thing
            <br />
            At The Right Moment
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time communication support for professionals, language learners, and anyone who wants to communicate more effectively.
            <br />
            Prepare better. Speak clearer. Break language barriers.
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a href="#download" className="btn btn-primary">Get Started Free</a>
            <a href="#features" className="btn btn-secondary">See How It Works</a>
          </motion.div>
        </div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="app-preview">
            <div className="app-preview-header">
              <div className="window-controls">
                <span className="control close" />
                <span className="control minimize" />
                <span className="control maximize" />
              </div>
              <span className="app-title">Assistant</span>
            </div>
            <div className="app-preview-content">
              <div className="chat-bubble ai">
                <p><strong>Communication Coach:</strong> The presenter is discussing system scalability. Key concepts: Load balancing → Caching layer → Database sharding. Would you like me to translate or explain any terms?</p>
              </div>
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Problem Section */}
      <section className="problem">
        <div className="problem-content">
          <motion.div
            className="problem-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2>You Know What to Say.<br />Just Not in The Moment.</h2>
            <p>High-stakes conversations demand real-time clarity, not hindsight.</p>
          </motion.div>
          <div className="problem-grid">
            <ProblemCard
              icon="🌐"
              title="Language Barriers"
              problem="Struggling to communicate in a second language during important conversations"
              delay={0}
            />
            <ProblemCard
              icon="💼"
              title="Business Meetings"
              problem="Meetings end with unclear action items and missed opportunities"
              delay={0.1}
            />
            <ProblemCard
              icon="📊"
              title="Presentations"
              problem="Losing your structure under pressure and forgetting key points"
              delay={0.2}
            />
            <ProblemCard
              icon="📚"
              title="Learning Sessions"
              problem="Concepts slip away before you can fully grasp them"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Not Recording. Guiding.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tools like Otter and Google Meet record the past. We shape the present.
          </motion.p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon="realtime"
            title="Live Response Suggestions"
            description="Don't wait until the call ends to know what you should have said. Get strategic responses in real-time as the conversation unfolds."
            delay={0}
          />
          <FeatureCard
            icon="screen"
            title="Screen Context Awareness"
            description="Analyzing what's on your screen right now—coding problems, presentations, documents—and suggesting responses that match the visual context."
            delay={0.1}
          />
          <FeatureCard
            icon="audio"
            title="Conversational Intelligence"
            description="Understanding who's speaking, what they're asking, and what matters. Track objections, questions, and action items as they happen."
            delay={0.2}
          />
        </div>
      </section>

      {/* Screen Analysis Showcase */}
      <section className="showcase">
        <div className="showcase-content">
          <motion.div
            className="showcase-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2>Clarity in The Moment</h2>
            <p>
              You're in a meeting with international colleagues. Technical terms fly by in a second language.
              Instead of struggling, you get real-time translation and context—communication without barriers.
            </p>
            <ul className="showcase-features">
              <li>Live translation between 30+ languages</li>
              <li>Context-aware explanations</li>
              <li>Automatic meeting notes and summaries</li>
              <li>Accessibility for all communication styles</li>
            </ul>
          </motion.div>
          <motion.div
            className="showcase-visual"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="screen-capture-demo">
              <div className="demo-screen-content">
                <div className="demo-code-snippet">
                  <div className="code-line">
                    <span className="keyword">class</span> <span className="class-name">LoadBalancer</span> {'{'}
                  </div>
                  <div className="code-line indent">
                    <span className="keyword">distribute</span>(<span className="param">requests</span>) {'{'}
                  </div>
                  <div className="code-line indent-2">
                    <span className="comment">// Scale horizontally...</span>
                  </div>
                </div>
              </div>
              <div className="capture-overlay">
                <div className="scan-line"></div>
                <div className="capture-progress">
                  <div className="progress-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="progress-text">
                    <span className="analyzing-label">Analyzing screen context</span>
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <span className="analyzing-status">Generating response...</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="profiles" id="profiles">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            One App. Every Scenario.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Scenario-specific guidance that adapts to your exact situation
          </motion.p>
        </div>

        <div className="profiles-grid">
          <ProfileCard
            emoji="🌐"
            title="Live Translation"
            description="Real-time translation for cross-language conversations—break barriers instantly"
            delay={0}
          />
          <ProfileCard
            emoji="💼"
            title="Meeting Assistant"
            description="End every meeting with clear decisions, action items, and structured notes"
            delay={0.1}
          />
          <ProfileCard
            emoji="🎤"
            title="Presentation"
            description="Stay on message and structured, even when questions throw you off track"
            delay={0.2}
          />
          <ProfileCard
            emoji="📚"
            title="Study Coach"
            description="Deepen understanding with guided explanations—learn concepts, not just answers"
            delay={0.3}
          />
          <ProfileCard
            emoji="🤝"
            title="Negotiation"
            description="Respond strategically with data-backed insights when stakes are high"
            delay={0.4}
          />
          <ProfileCard
            emoji="🧠"
            title="Accessibility"
            description="Cognitive support for neurodivergent users—reduce anxiety, stay focused"
            delay={0.5}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="download">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>Communicate Better.<br />Break Language Barriers.</h2>
          <p>Free and open source. Bring your own Gemini API key.</p>
          <div className="cta-buttons">
            <a href="https://github.com/harsh194/assistant/releases/latest" className="btn btn-primary btn-large" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download for macOS
            </a>
            <a href="https://github.com/harsh194/assistant/releases/latest" className="btn btn-secondary btn-large" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z"/>
              </svg>
              Download for Windows
            </a>
            <a href="https://github.com/harsh194/assistant/releases/latest" className="btn btn-secondary btn-large" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.468v.018c.003.128.027.26.086.39.016.037.064.132.12.198a.926.926 0 00-.213.065c-.093.042-.16.065-.258.132-.046-.067-.08-.132-.127-.198a.833.833 0 01-.132-.332 1.515 1.515 0 01-.096-.633v-.105l.006.06c.006-.267.053-.468.159-.664.104-.2.247-.4.438-.533.19-.135.39-.198.618-.198zm-2.072.882c.106 0 .2.016.293.066.19.085.31.2.41.4.098.133.14.267.151.4 0-.02.003-.04.003-.06v.105c0 .036-.002.073-.004.109l-.002.02c-.013.106-.038.208-.088.334-.028.066-.086.132-.132.198a.645.645 0 00-.213-.067 1.286 1.286 0 00-.267-.132c.05-.06.146-.133.183-.198.043-.106.055-.2.073-.4v-.02c.003-.028.002-.055.002-.08v-.073c-.003-.106-.013-.2-.05-.333a.548.548 0 00-.15-.266.374.374 0 00-.262-.1h-.015a.367.367 0 00-.262.099.578.578 0 00-.15.266.858.858 0 00-.05.266v.022c.003.073.01.133.018.2.022.106.044.2.106.332.019.037.064.132.12.198a1.173 1.173 0 00-.213.065c-.106.032-.178.066-.274.132-.049-.068-.08-.132-.127-.199a.896.896 0 01-.132-.332 1.298 1.298 0 01-.09-.633v-.105l.003.06c.013-.2.053-.4.158-.6.11-.2.243-.4.438-.533.195-.134.378-.198.559-.198zm4.101 0c.106 0 .2.016.293.066.19.085.31.2.41.4.098.133.14.267.15.4 0-.02.004-.04.004-.06v.105c0 .036-.002.073-.004.109l-.002.02c-.013.106-.038.208-.088.334-.028.066-.086.132-.132.198a.645.645 0 00-.213-.067 1.286 1.286 0 00-.267-.132c.05-.06.146-.133.183-.198.043-.106.055-.2.073-.4v-.02c.003-.028.002-.055.002-.08v-.073c-.003-.106-.013-.2-.05-.333a.548.548 0 00-.15-.266.374.374 0 00-.262-.1h-.015a.367.367 0 00-.262.099.578.578 0 00-.15.266.858.858 0 00-.05.266v.022c.003.073.01.133.018.2.022.106.044.2.106.332.019.037.064.132.12.198a1.173 1.173 0 00-.213.065c-.106.032-.178.066-.274.132-.049-.068-.08-.132-.127-.199a.896.896 0 01-.132-.332 1.298 1.298 0 01-.09-.633v-.105l.003.06c.013-.2.053-.4.158-.6.11-.2.243-.4.438-.533.195-.134.378-.198.559-.198z"/>
              </svg>
              Download for Linux
            </a>
          </div>
          <p className="cta-source">
            <a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer">
              ⭐ View Source on GitHub
            </a>
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo">Assistant</span>
            <p>Real-time AI guidance when it matters most</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#profiles">Profiles</a>
              <a href="#download">Download</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <Link to="/documentation">Documentation</Link>
              <Link to="/api-setup">API Key Setup</Link>
              <Link to="/support">Support</Link>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
            <div className="footer-column">
              <h4>Open Source</h4>
              <a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
              <a href="https://github.com/harsh194/assistant/issues" target="_blank" rel="noopener noreferrer">Report Issues</a>
              <a href="https://github.com/harsh194/assistant/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">License (MIT)</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Built with Gemini AI • <a href="https://github.com/harsh194/assistant" target="_blank" rel="noopener noreferrer">Open Source on GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}

function ProblemCard({ icon, title, problem, delay }) {
  return (
    <motion.div
      className="problem-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="problem-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{problem}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  const icons = {
    realtime: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    screen: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    audio: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="feature-icon">{icons[icon]}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

function ProfileCard({ emoji, title, description, delay }) {
  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <span className="profile-emoji">{emoji}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

export default Home;
