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
        setSuccessMsg("🎉 Account Created Successfully!");
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
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #ffffff 0%, #fff0f0 50%, #ffe5e5 100%)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Animated background glow orbs */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.25 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff4d4d 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 2.5 }}
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-120px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #ff9999 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Signup Card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "420px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          padding: "40px 30px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(255, 50, 50, 0.25)",
          border: "1px solid rgba(255,150,150,0.3)",
          zIndex: 2,
        }}
      >
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#cc0000",
            fontWeight: 700,
          }}
        >
          🏦 Create Your Bank Account
        </motion.h3>
        <p
          style={{
            textAlign: "center",
            color: "#a60000",
            marginBottom: "25px",
            fontSize: "0.95rem",
          }}
        >
          Secure. Fast. Reliable Banking.
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "#d10000",
              background: "#ffe6e6",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
              marginBottom: "15px",
              fontWeight: 500,
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ffb3b3" }}
            transition={{ duration: 0.2 }}
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ffb3b3" }}
            transition={{ duration: 0.2 }}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ffb3b3" }}
            transition={{ duration: 0.2 }}
            type="tel"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ffb3b3" }}
            transition={{ duration: 0.2 }}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={inputStyle}
          />
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 12px #ffb3b3" }}
            transition={{ duration: 0.2 }}
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
            style={inputStyle}
          />

          <motion.button
            whileHover={{
              scale: 1.05,
              background:
                "linear-gradient(135deg, #ff4d4d 0%, #ff6666 60%, #ffb3b3 100%)",
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
                "linear-gradient(135deg, #cc0000 0%, #ff3333 70%, #ff8080 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </motion.button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "0.9rem",
            color: "#a60000",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#cc0000",
              fontWeight: 600,
              textDecoration: "none",
            }}
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
              background: "rgba(255, 200, 200, 0.4)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "#fff",
                borderRadius: "18px",
                border: "2px solid #ffb3b3",
                boxShadow: "0 12px 30px rgba(255, 0, 0, 0.25)",
                padding: "35px 60px",
                textAlign: "center",
                color: "#a60000",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 120, damping: 8 }}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#ffcccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 10px auto",
                  boxShadow: "0 0 20px rgba(255,0,0,0.3)",
                }}
              >
                <span style={{ fontSize: "32px" }}>✅</span>
              </motion.div>
              <p style={{ fontWeight: 600, fontSize: "16px" }}>{successMsg}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "1px solid #ffcccc",
  background: "rgba(255, 255, 255, 0.9)",
  color: "#a60000",
  fontSize: "0.95rem",
  outline: "none",
  boxShadow: "0 2px 6px rgba(255, 180, 180, 0.15)",
};

export default Signup;
