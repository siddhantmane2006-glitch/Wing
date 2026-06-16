"use client";

import React, { useState, useEffect, useRef } from "react";

const VideoCard = ({ videoSrc, angle }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log("Video auto-play blocked", e));
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      {
        // Trigger when at least 10% of the video is visible
        threshold: 0.1
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="video-card"
      style={{
        transform: `rotate(${angle}deg)`
      }}
    >
      <div className="card-content">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        // autoPlay needed for Safari/iOS - muted+playsInline+autoPlay is allowed
        // Observer still pauses off-screen videos to save performance
        />
      </div>
    </div>
  );
};

const MagneticButton = ({ children, style }) => {
  const buttonRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.4;
    const y = (clientY - (top + height / 2)) * 0.4;
    buttonRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    buttonRef.current.style.transform = `translate(0px, 0px)`;
    setIsPressed(false);
  };

  return (
    <div
      style={{ padding: "1rem", display: "inline-block", cursor: "pointer", transform: isPressed ? "scale(0.95)" : "scale(1)", transition: "transform 0.1s ease" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <button
        ref={buttonRef}
        style={{
          background: "var(--btn-bg)",
          color: "var(--btn-text)",
          border: "none",
          padding: "16px 40px",
          borderRadius: "50px",
          fontSize: "1.1rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: '"Google Sans", sans-serif',
          transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          ...style
        }}
      >
        {children}
      </button>
    </div>
  );
};

const ScrollHighlightText = ({ highlightText, staticText }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // Start animating when element top crosses 80% of viewport
        // End when element bottom crosses top 20% of viewport
        const animStart = vh * 0.8 - rect.top;
        const animRange = rect.height + vh * 0.5;
        const p = Math.max(0, Math.min(1, animStart / animRange));
        setProgress(p);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const words = highlightText.split(" ");

  return (
    <h2
      ref={containerRef}
      style={{
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: "clamp(2rem, 4vw, 3.5rem)",
        fontWeight: 500,
        lineHeight: 1.3,
        letterSpacing: "-0.03em",
        margin: "0 0 3rem 0",
      }}
    >
      {words.map((word, i) => {
        const wordStart = i / words.length;
        const wordEnd = (i + 1) / words.length;
        const lit = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)));
        return (
          <span
            key={i}
            className="scroll-word"
            style={{
              color: lit > 0.5 ? "#ffffff" : "var(--text-muted)",
              transition: "color 0.2s ease",
            }}
          >
            {word}{" "}
          </span>
        );
      })}
      <span style={{ color: "var(--text-muted)" }}>{staticText}</span>
    </h2>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const videos = [
    "/videos/12900608_3840_2160_120fps (online-video-cutter.com).webm",
    "/videos/5219161-uhd_3840_2160_30fps (online-video-cutter.com).webm",
    "/videos/6892735-uhd_2160_4096_25fps (online-video-cutter.com).webm",
    "/videos/7812404-hd_1080_1920_25fps (online-video-cutter.com).webm",
    "/videos/8716795-uhd_3840_2160_25fps (online-video-cutter.com).webm"
  ];

  const baseItems = [...videos, ...videos, ...videos, ...videos];
  const carouselItems = baseItems; // Keep it at 20 cards to prevent mobile browsers from crashing

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)", overflowX: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>

      {/* Center Content */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 10, padding: "10rem 2rem 0 2rem", marginBottom: "4rem" }}>
        <h1 className="headline-interactive" style={{
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: "clamp(3.5rem, 8vw, 7rem)",
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: "var(--text-main)",
          margin: "0 0 1rem 0",
          lineHeight: 1.1
        }}>
          Never Go <span className="blank-word">Blank.</span>
        </h1>
        <p style={{
          fontFamily: '"Google Sans", sans-serif',
          color: "var(--text-muted)",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          maxWidth: "650px",
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          The open-source AI wingman for your smart glasses. The lightning fast audio transcription and Gemini's contextual power make Wing listen in on your conversation to provide you with optimal replies in your HUD.
        </p>

        <div style={{ marginTop: "2.5rem" }}>
          <button
            style={{
              background: "var(--btn-bg)",
              color: "var(--btn-text)",
              border: "none",
              padding: "16px 32px",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: 600,
              fontFamily: '"Google Sans", sans-serif',
              opacity: 0.7,
              cursor: "default"
            }}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* 2D Circular Carousel Section */}
      <div className="carousel-container">
        <div className="carousel-spinner">
          {carouselItems.map((videoSrc, idx) => {
            // Calculate rotation angle for a 2D wheel
            const angle = idx * (360 / carouselItems.length);
            return (
              <VideoCard key={idx} videoSrc={videoSrc} angle={angle} />
            );
          })}
        </div>
      </div>

      {/* About Section - Highlight text + cards */}
      <section style={{ background: "var(--bg-color)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem 0 2rem" }}>
          <ScrollHighlightText
            highlightText="A brand new species of conversational tool."
            staticText=" Purpose-built for modern conversation with an advanced AI reasoning capability at its heart, Wing elevates confidence in conversation."
          />
          <div className="about-cards-container" style={{ paddingBottom: "8rem" }}>
            {/* Card 1 */}
            <div className="about-card" style={{ background: "linear-gradient(135deg, #e4ebfe 0%, #ebe2fa 100%)" }}>
              <svg width="400" height="400" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)" style={{ position: "absolute", right: "-100px", top: "50px", zIndex: 1 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <h3 style={{ color: "#111111", zIndex: 2, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: "400", lineHeight: "1.2", letterSpacing: "-0.04em", fontFamily: 'var(--font-poppins), sans-serif' }}>
                “Conversations are rapid. Don't get stuck because you 'can't think of anything' at the crucial moment.”
              </h3>
            </div>

            {/* Card 2 */}
            <div className="about-card" style={{ background: "#dcf52a" }}>
              <h3 style={{ color: "#111111", zIndex: 2, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: "400", lineHeight: "1.2", letterSpacing: "-0.04em", fontFamily: 'var(--font-poppins), sans-serif' }}>
                “Instant and relevant reminders to your smart glasses in the moment it is required.”
              </h3>
            </div>

            {/* Card 3 */}
            <div className="about-card" style={{ background: "#ffffff", border: "1px solid #eaeaea" }}>
              <h3 style={{ color: "#111111", zIndex: 2, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: "400", lineHeight: "1.2", letterSpacing: "-0.04em", fontFamily: 'var(--font-poppins), sans-serif' }}>
                “Wear the glasses, link the app and start speaking, it's really that easy.”
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section style={{ padding: "6rem 2rem", background: "var(--bg-color)", position: "relative", zIndex: 10 }}>
        <div className="founder-container">
          {/* Image Side */}
          <div className="founder-image-wrapper">
            <img
              src="/images/founder.jpg"
              alt="Founder of Wing"
              className="founder-image"
            />
          </div>

          {/* Text Side */}
          <div className="founder-text-content">
            <p style={{
              marginTop: 0,
              fontSize: "clamp(1.2rem, 2vw, 1.4rem)",
              lineHeight: 1.6,
              color: "#ffffff",
              fontFamily: 'var(--font-google-sans)',
              fontWeight: 400,
              marginBottom: "2.5rem",
              position: "relative",
              zIndex: 2
            }}>
              "Social anxiety made even a small conversation difficult to maintain. We knew AI could help but not live—until smart glasses arrived. Wing is my project that closes this gap. Wing is an active AI helper that makes sure you never blank again—arming you with the confidence to interact and speak fully."
            </p>

            <div style={{ paddingTop: "1.5rem", zIndex: 2, fontFamily: 'var(--font-google-sans)' }}>
              <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#ffffff" }}>Siddhant</h4>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>Founder of Wing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - Expo Style */}
      <footer style={{ background: "var(--footer-bg)", width: "100%", padding: "4rem 2rem 2rem 2rem", marginTop: "auto", fontFamily: '"Google Sans", var(--font-poppins), sans-serif' }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Top Banner (Black Card with Video Background) */}
          <div style={{ 
            background: "var(--footer-card-bg)", 
            borderRadius: "32px", 
            padding: "6rem 2rem", 
            textAlign: "center", 
            marginBottom: "5rem",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Background Video */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.5, pointerEvents: "none", overflow: "hidden" }}>
              <video
                src="/videos/Si6ej2ZRrxRCnTYBXSScDRCdd7CGnyTqiPszZcw3z4I.webm"
                autoPlay
                loop
                muted
                defaultMuted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            
            {/* Content Overlay */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ color: "var(--footer-card-text)", fontSize: "clamp(1.7rem, 6vw, 3rem)", fontWeight: "700", marginBottom: "1.5rem", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>Converse like a Pro</h2>
              <p style={{ color: "var(--footer-card-muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 3rem auto", lineHeight: "1.6" }}>
                Never experience a blank moment again. Wing delivers context-aware, real-time cues straight to your smart glasses.
              </p>
              <button
                style={{
                  background: "var(--btn-bg)",
                  color: "var(--btn-text)",
                  border: "none",
                  padding: "16px 36px",
                  borderRadius: "50px",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  fontFamily: '"Google Sans", sans-serif',
                  opacity: 0.7,
                  cursor: "default"
                }}
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
            {/* Logo Column */}
            <div style={{ gridColumn: "1 / -1", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "var(--font-leckerli)", fontSize: "2rem", color: "var(--footer-text)", fontWeight: "bold" }}>
                Wing
              </div>
            </div>

            {/* Link Columns */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ color: "var(--footer-text)", fontSize: "0.95rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>Product</h4>
              <a href="#" className="footer-link">Wing on GitHub</a>
              <a href="#" className="footer-link">Wing CLI</a>
              <a href="#" className="footer-link">Wing Services</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ color: "var(--footer-text)", fontSize: "0.95rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>Resources</h4>
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Changelog</a>
              <a href="#" className="footer-link">Support</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ color: "var(--footer-text)", fontSize: "0.95rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>Solutions</h4>
              <a href="#" className="footer-link">Enterprise</a>
              <a href="#" className="footer-link">Startup</a>
              <a href="#" className="footer-link">Solo devs</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ color: "var(--footer-text)", fontSize: "0.95rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>Company</h4>
              <a href="#" className="footer-link">Home</a>
              <a href="#" className="footer-link">Pricing</a>
              <a href="#" className="footer-link">Customers</a>
              <a href="#" className="footer-link">About</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ color: "var(--footer-text)", fontSize: "0.95rem", fontWeight: "700", margin: "0 0 0.5rem 0" }}>Legal</h4>
              <a href="#" className="footer-link">Terms of service</a>
              <a href="#" className="footer-link">Privacy policy</a>
              <a href="#" className="footer-link">Security</a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.85rem", color: "var(--footer-card-muted)" }}>
              <span>©2026 Wing</span>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <a href="#" className="footer-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </a>
              <a href="#" className="footer-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="footer-link" aria-label="Discord">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.118.098.246.2.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
