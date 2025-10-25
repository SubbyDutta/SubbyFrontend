import React, { useState } from "react";
import { motion } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup Successful ✅ ");
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
        background: "radial-gradient(circle at top, #1a0000 0%, #330000 40%, #660000 80%, #ff1a1a 120%)",
        overflow: "hidden",
        position: "relative",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Glowing red background orbs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff4d4d 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff1a1a 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "400px",
          padding: "40px 30px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 25px rgba(255, 50, 50, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            marginBottom: "25px",
            fontSize: "1.8rem",
            fontWeight: 600,
            color: "#ffe6e6",
            letterSpacing: "0.5px",
          }}
        >
          Create Account
        </motion.h2>

        <form onSubmit={handleSubmit}>
          {/* All your original input fields */}
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ff4d4d" }}
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
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ff4d4d" }}
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
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ff4d4d" }}
            transition={{ duration: 0.2 }}
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ff4d4d" }}
            transition={{ duration: 0.2 }}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ff4d4d" }}
            transition={{ duration: 0.2 }}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <motion.button
            whileHover={{
              scale: 1.05,
              background:
                "linear-gradient(135deg, #ff4d4d 0%, #ff1a1a 50%, #ffffff 100%)",
              boxShadow: "0 0 20px rgba(255, 50, 50, 0.6)",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.3 }}
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background:
                "linear-gradient(135deg, #b30000 0%, #ff1a1a 80%, #ff8080 100%)",
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

// 🔹 Common input styles (dark red glass look)
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  background: "rgba(255, 255, 255, 0.05)",
  color: "#ffe6e6",
  fontSize: "0.95rem",
  outline: "none",
};

export default Signup;
