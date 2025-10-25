import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }
  const navigate = useNavigate();

  useEffect(() => {
    // Background animation CSS
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bgMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function validateEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!email || !validateEmail(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setSending(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setMessage({ type: "success", text: "OTP sent to your email. Check your inbox." });
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to send OTP. Try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="forgot-root"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #b30000, #ff6666, #ffffff)",
        backgroundSize: "300% 300%",
        animation: "bgMove 10s ease infinite",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "480px",
          padding: "35px 30px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 10px 35px rgba(179,0,0,0.25)",
          backdropFilter: "blur(6px)",
        }}
      >
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center fw-bold mb-2"
          style={{ color: "#b30000" }}
        >
          🔑 Forgot Password
        </motion.h3>
        <p className="text-center text-muted mb-4">
          Enter your registered email to receive an OTP
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Registered Email</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              style={{
                borderRadius: "10px",
                border: "1.5px solid #ff9999",
                padding: "10px",
                outline: "none",
              }}
            />
          </div>

          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending}
              className="btn w-100 fw-semibold"
              style={{
                background: "linear-gradient(90deg, #ff4d4d, #b30000)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                padding: "10px",
                boxShadow: "0 5px 15px rgba(255,0,0,0.3)",
              }}
            >
              {sending ? "Sending OTP..." : "Send OTP"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate("/login")}
              className="btn w-100 fw-semibold"
              style={{
                background: "white",
                border: "1.5px solid #b30000",
                borderRadius: "10px",
                color: "#b30000",
                padding: "10px",
              }}
            >
              Back to login
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-3 small">
          Remembered your password?{" "}
          <a href="/login" className="fw-semibold text-danger text-decoration-none">
            Log in
          </a>
        </div>
      </motion.div>

      {/* ✅ Animated Popup Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255,0,0,0.15)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: "18px",
                border: "2px solid #ffb3b3",
                boxShadow: "0 10px 30px rgba(255,0,0,0.3)",
                padding: "30px 50px",
                textAlign: "center",
                color: message.type === "error" ? "#cc0000" : "#006400",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setMessage(null)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 120, damping: 8 }}
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  background: message.type === "error" ? "#ffcccc" : "#ccffcc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow:
                    message.type === "error"
                      ? "0 0 25px rgba(255,0,0,0.3)"
                      : "0 0 25px rgba(0,128,0,0.3)",
                  margin: "0 auto 10px auto",
                }}
              >
                <span style={{ fontSize: "30px" }}>
                  {message.type === "error" ? "❌" : "✅"}
                </span>
              </motion.div>
              <p style={{ fontWeight: 600, fontSize: "16px" }}>{message.text}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
