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
    alert("Signup Successful ❤️");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #fff0f0 0%, #ffe5e5 40%, #ffcccc 100%)",
        overflow: "hidden",
        position: "relative",
        color: "#a60000",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Glowing background orbs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff8080 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2.5 }}
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff4d4d 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "420px",
          padding: "35px 28px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 40px rgba(255, 100, 100, 0.25)",
          border: "1px solid rgba(255, 150, 150, 0.5)",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            marginBottom: "25px",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "#cc0000",
          }}
        >
          Create Account
        </motion.h2>

        <form onSubmit={handleSubmit}>
          {/* Inputs */}
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px #ff9999" }}
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
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px #ff9999" }}
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
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px #ff9999" }}
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
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px #ff9999" }}
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
            whileFocus={{ scale: 1.02, boxShadow: "0 0 10px #ff9999" }}
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
                "linear-gradient(135deg, #ff3333 0%, #ff4d4d 50%, #ff8080 100%)",
              boxShadow: "0 0 15px rgba(255, 0, 0, 0.4)",
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
                "linear-gradient(135deg, #ff4d4d 0%, #ff6666 80%, #ff9999 100%)",
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

        <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#cc0000", fontWeight: 600, textDecoration: "none" }}
          >
            Login
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "1px solid #ffcccc",
  background: "rgba(255, 255, 255, 0.8)",
  color: "#a60000",
  fontSize: "0.95rem",
  outline: "none",
  boxShadow: "0 3px 6px rgba(255, 180, 180, 0.15)",
};

export default Signup;
