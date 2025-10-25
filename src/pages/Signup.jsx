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
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <motion.div
      className="signup-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff0f0, #ffdcdc)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Floating background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff9999 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffb3b3 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "400px",
          padding: "40px 30px",
          borderRadius: "18px",
          boxShadow: "0 10px 35px rgba(255, 0, 0, 0.2)",
          background: "white",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            color: "#a60000",
            fontWeight: "700",
            fontSize: "1.6rem",
            marginBottom: "8px",
          }}
        >
          📝 Create Account
        </motion.h2>
        <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.95rem" }}>
          Sign up to access your dashboard
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: "#ffe5e5",
              borderRadius: "8px",
              padding: "8px 10px",
              color: "#a60000",
              marginBottom: "12px",
              fontWeight: "600",
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {["username", "email", "mobile"].map((field, i) => (
            <motion.input
              key={field}
              type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
              whileFocus={{ scale: 1.02, borderColor: "#ff6666" }}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1.8px solid #ffcccc",
                outline: "none",
                fontSize: "0.95rem",
                transition: "0.3s",
              }}
            />
          ))}

          {["password", "confirmPassword"].map((field, i) => (
            <motion.input
              key={field}
              type="password"
              placeholder={
                field === "confirmPassword" ? "Confirm Password" : "Password"
              }
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
              whileFocus={{ scale: 1.02, borderColor: "#ff6666" }}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1.8px solid #ffcccc",
                outline: "none",
                fontSize: "0.95rem",
                transition: "0.3s",
              }}
            />
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "linear-gradient(90deg, #ff6b6b, #ff4d4d)",
              color: "white",
              fontWeight: "600",
              border: "none",
              borderRadius: "10px",
              padding: "10px 0",
              marginTop: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255,0,0,0.3)",
              transition: "0.3s ease",
            }}
          >
            Sign Up
          </motion.button>
        </form>

        <p
          className="text-center mt-3 small-muted"
          style={{ marginTop: "16px", fontSize: "0.9rem", color: "#555" }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#cc0000", fontWeight: "600", textDecoration: "none" }}
          >
            Login
          </a>
        </p>
      </motion.div>

      {/* Success Popup */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255, 220, 220, 0.5)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "white",
                padding: "30px 50px",
                borderRadius: "20px",
                border: "2px solid #ff9999",
                boxShadow: "0 10px 25px rgba(255,0,0,0.3)",
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 120, damping: 8 }}
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  background: "#ffcccc",
                  margin: "0 auto 10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                ✅
              </motion.div>
              <p
                style={{
                  color: "#a60000",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {successMsg}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Signup;
