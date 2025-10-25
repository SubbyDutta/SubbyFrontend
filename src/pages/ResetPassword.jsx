import React, { useState, useEffect } from "react";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = (location.state && location.state.email) || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
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

  function validateForm() {
    if (!email) return "Email is required.";
    if (!otp) return "OTP is required.";
    if (!newPassword) return "New password is required.";
    if (newPassword.length < 6) return "Password must be at least 6 characters.";
    if (newPassword !== confirm) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    const err = validateForm();
    if (err) {
      setMessage({ type: "error", text: err });
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      setMessage({ type: "success", text: "Password reset successful. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Reset failed. Check OTP and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
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
          width: "520px",
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
          🔑 Reset Password
        </motion.h3>
        <p className="text-center text-muted mb-4">
          Enter your email, OTP, and new password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="Registered email"
              required
              style={{ borderRadius: "10px", border: "1.5px solid #ff9999", padding: "10px", outline: "none" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">OTP</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              placeholder="Enter OTP sent to email"
              required
              style={{ borderRadius: "10px", border: "1.5px solid #ff9999", padding: "10px", outline: "none" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">New Password</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
                style={{ borderRadius: "10px", border: "1.5px solid #ff9999", padding: "10px", outline: "none", flex: 1 }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  border: "1.5px solid #b30000",
                  borderRadius: "10px",
                  padding: "0 10px",
                  color: "#b30000",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </motion.button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold">Confirm Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat new password"
              required
              style={{ borderRadius: "10px", border: "1.5px solid #ff9999", padding: "10px", outline: "none" }}
            />
          </div>

          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting}
              className="btn w-100 fw-semibold"
              style={{ background: "linear-gradient(90deg, #ff4d4d, #b30000)", border: "none", borderRadius: "10px", color: "#fff", padding: "10px", boxShadow: "0 5px 15px rgba(255,0,0,0.3)" }}
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate("/login")}
              className="btn w-100 fw-semibold"
              style={{ background: "white", border: "1.5px solid #b30000", borderRadius: "10px", color: "#b30000", padding: "10px" }}
            >
              Back to login
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-3 small">
          Didn’t get OTP? Go back to{" "}
          <a href="/forgot-password" className="fw-semibold text-danger text-decoration-none">
            Forgot Password
          </a>{" "}
          to request again.
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
