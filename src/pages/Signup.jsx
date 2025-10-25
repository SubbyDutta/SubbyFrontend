// src/pages/Signup.jsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/auth/signup", {
        username: form.username,
        password: form.password,
        email: form.email,
        mobile: form.mobile,
      });

      const message = res.data;
      if (message.includes("already exists")) {
        setError(message);
      } else {
        setSuccessMsg("🎉 Signup Successful! Redirecting to login...");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="signup-root"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #b30000, #ff6666, #ffffff)",
        backgroundSize: "300% 300%",
        animation: "bgMove 12s ease infinite",
      }}
    >
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "420px",
          padding: "35px 30px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(179, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(8px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            color: "#b30000",
            marginBottom: "5px",
            fontWeight: "700",
          }}
        >
           Create Your Account
        </motion.h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          Join our secure banking platform today
        </p>

        {/* Error Message */}
        {error && (
          <motion.div
            className="error-message"
            style={{
              color: "#cc0000",
              textAlign: "center",
              marginBottom: 12,
              fontWeight: 600,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={{
              border: "1.5px solid #ff9999",
              padding: "10px 14px",
              borderRadius: "8px",
              outline: "none",
            }}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              border: "1.5px solid #ff9999",
              padding: "10px 14px",
              borderRadius: "8px",
            }}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="input"
            type="tel"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
            style={{
              border: "1.5px solid #ff9999",
              padding: "10px 14px",
              borderRadius: "8px",
            }}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              border: "1.5px solid #ff9999",
              padding: "10px 14px",
              borderRadius: "8px",
            }}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="input"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
            style={{
              border: "1.5px solid #ff9999",
              padding: "10px 14px",
              borderRadius: "8px",
            }}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "linear-gradient(90deg, #ff4d4d, #cc0000)",
              color: "#fff",
              border: "none",
              padding: "12px 0",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              boxShadow: "0 5px 15px rgba(255, 0, 0, 0.3)",
            }}
          >
            Sign Up
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-3 small-muted">
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#b30000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </a>
        </div>

        {/* Success Popup */}
        <AnimatePresence>
          {successMsg && (
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
                background: "rgba(255, 0, 0, 0.15)",
                backdropFilter: "blur(6px)",
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
                  background: "#fff",
                  borderRadius: "18px",
                  border: "2px solid #ffb3b3",
                  boxShadow: "0 10px 30px rgba(255, 0, 0, 0.3)",
                  padding: "30px 50px",
                  textAlign: "center",
                  color: "#b30000",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 120, damping: 8 }}
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    background: "#ffcccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 25px rgba(255,0,0,0.3)",
                    margin: "0 auto 10px auto",
                  }}
                >
                  <span style={{ fontSize: "30px" }}>✅</span>
                </motion.div>
                <p style={{ fontWeight: 600, fontSize: "16px" }}>{successMsg}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🔥 Background Animation Keyframes */}
      <style>
        {`
          @keyframes bgMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
