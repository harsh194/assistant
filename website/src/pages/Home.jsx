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
            Get instant, strategic suggestions during interviews, sales calls, and high-stakes meetings.
            <br />
            Not after. Not tomorrow. Right now when it matters most.
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
                <p><strong>Interview Coach:</strong> They're asking about system scalability. Frame your answer with: Load balancing → Caching layer → Database sharding. Start with the user request flow.</p>
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
              icon="🎯"
              title="Job Interviews"
              problem="You know your skills, but freeze when asked behavioral questions"
              delay={0}
            />
            <ProblemCard
              icon="💼"
              title="Sales Calls"
              problem="You miss objections and realize the perfect response 5 minutes too late"
              delay={0.1}
            />
            <ProblemCard
              icon="📊"
              title="Meetings"
              problem="Meetings end with no decisions, unclear action items, and wasted time"
              delay={0.2}
            />
            <ProblemCard
              icon="🎤"
              title="Presentations"
              problem="You lose your structure under pressure and forget key points"
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
              You're in a technical interview. A system design question appears on screen.
              Instead of panicking, you get structured guidance instantly—no guessing, no blanking out.
            </p>
            <ul className="showcase-features">
              <li>Real-time code and diagram analysis</li>
              <li>Structured response frameworks</li>
              <li>Strategic talking points, not scripts</li>
              <li>Confidence when it counts</li>
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
            emoji="💼"
            title="Interview"
            description="Turn nervousness into structured, confident responses that highlight your strengths"
            delay={0}
          />
          <ProfileCard
            emoji="📊"
            title="Sales Call"
            description="Catch objections as they happen and respond with precision—not improvisation"
            delay={0.1}
          />
          <ProfileCard
            emoji="🎯"
            title="Meeting"
            description="End every meeting with clear decisions and action items, not confusion"
            delay={0.2}
          />
          <ProfileCard
            emoji="🎤"
            title="Presentation"
            description="Stay on message and structured, even when questions throw you off track"
            delay={0.3}
          />
          <ProfileCard
            emoji="🤝"
            title="Negotiation"
            description="Respond strategically, not emotionally. Keep leverage when pressure rises"
            delay={0.4}
          />
          <ProfileCard
            emoji="📚"
            title="Exam"
            description="Get instant explanations and clarity when you're stuck—no more blanking out"
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
          <h2>Stop Replaying Conversations.<br />Start Winning Them.</h2>
          <p>Free download. Bring your own Gemini API key.</p>
          <div className="cta-buttons">
            <a href="#" className="btn btn-primary btn-large">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download for macOS
            </a>
            <a href="#" className="btn btn-secondary btn-large">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z"/>
              </svg>
              Download for Windows
            </a>
          </div>
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
          </div>
        </div>
        <div className="footer-bottom">
          <p>Built with Gemini AI</p>
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
