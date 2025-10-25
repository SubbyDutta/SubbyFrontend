import React, { useState } from "react";
import { motion } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup Successful 🚀");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="signup-root"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top left, #111827, #0f172a, #020617)",
        overflow: "hidden",
        position: "relative",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Animated glowing background orbs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Signup card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "380px",
          padding: "40px 30px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1,
        }}
      >
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "1.8rem",
            fontWeight: 600,
            color: "#e5e7eb",
          }}
        >
          Create Account
        </motion.h2>

        <form onSubmit={handleSubmit}>
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #6366f1" }}
            transition={{ duration: 0.2 }}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #8b5cf6" }}
            transition={{ duration: 0.2 }}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ec4899" }}
            transition={{ duration: 0.2 }}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <motion.button
            whileHover={{
              scale: 1.05,
              background:
                "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3 }}
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background:
                "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 50%, #ec4899 100%)",
              color: "white",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Sign Up
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// 🔹 Common input styles
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#f3f4f6",
  fontSize: "0.95rem",
  outline: "none",
};

export default Signup;
