import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <h1>AI-Powered Resume Screening</h1>
        <p className={styles.subtitle}>
          Streamline your hiring process with intelligent resume analysis
        </p>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h2>Smart Resume Analysis</h2>
          <p>
            Leverage advanced AI to analyze resumes and extract key information
            automatically. Get instant insights into candidate qualifications
            and experience.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h2>Interactive Chat Interface</h2>
          <p>
            Engage with our AI assistant to discuss candidate profiles, ask
            questions, and get detailed analysis of resumes in real-time.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h2>Data-Driven Insights</h2>
          <p>
            Make informed hiring decisions with comprehensive analytics and
            detailed candidate evaluations powered by cutting-edge AI
            technology.
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Transform Your Hiring Process?</h2>
        <p>
          Start screening resumes with AI today and experience the future of
          recruitment.
        </p>
        <a href="/chat" className={styles.ctaButton}>
          Get Started
        </a>
      </section>
    </div>
  );
}
