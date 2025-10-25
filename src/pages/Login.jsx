import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }
  const navigate = useNavigate();

  useEffect(() => {
    // Background animation
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

  // Auto-close popup after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const token = res.data.token ?? res.data?.accessToken ?? null;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      const payload = jwtDecode(token);
      const role =
        payload.role || payload?.authorities || payload?.roles || payload?.roleName;

      setMessage({ type: "success", text: "✅ Login Successful! Redirecting..." });

      setTimeout(() => {
        if (String(role ?? "").toUpperCase().includes("ADMIN")) navigate("/admin");
        else navigate("/user");
      }, 2500);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "❌ Login failed. Check username/password or server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-root"
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
          width: "420px",
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
          🔐 Welcome Back
        </motion.h3>
        <p className="text-center text-muted mb-4">
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Username</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              style={{
                borderRadius: "10px",
                border: "1.5px solid #ff9999",
                padding: "10px",
                outline: "none",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Password</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={{
                borderRadius: "10px",
                border: "1.5px solid #ff9999",
                padding: "10px",
                outline: "none",
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
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
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <div className="text-center mt-3 small">
            <a href="/forgot-password" className="text-danger fw-semibold text-decoration-none">
              Forgot Password?
            </a>
          </div>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don’t have an account?{" "}
            <a href="/" className="fw-semibold text-danger text-decoration-none">
              Sign Up
            </a>
          </small>
        </div>
      </motion.div>

      {/* ✅ Animated Popup Message with Close Button */}
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
