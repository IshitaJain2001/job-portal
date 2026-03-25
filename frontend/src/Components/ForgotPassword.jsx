import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Stylesheets/AuthPages.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "https://job-portal-backend-2l04.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Check your email for reset link");
        setSubmitted(true);
      } else {
        setError(data.message || "Error sending reset email");
      }
    } catch (err) {
      setError("Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>Check Your Email</h1>
          <div className="success-message">
            <p>✓ {message}</p>
            <p className="info-text">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="info-text">
              The link will expire in 1 hour. If you don't see the email, check
              your spam folder.
            </p>
          </div>
          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Forgot Password?</h1>
        <p className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
