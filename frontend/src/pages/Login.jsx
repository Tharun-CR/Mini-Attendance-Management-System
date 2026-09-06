import { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      console.log(response.data.token);
      sessionStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-shape shape-one"></div>
      <div className="background-shape shape-two"></div>

      <div className="login-container">
        {/* Left Side */}
        <div className="login-banner">
          <div className="logo">
            <span>✓</span>
          </div>

          <h1>
            Attendance Made
            <br />
            Simple.
          </h1>

          <p>
            Manage your employees and track attendance efficiently from one
            centralized platform.
          </p>

          <div className="features">
            <div className="feature">
              <span>✓</span>
              Employee Management
            </div>

            <div className="feature">
              <span>✓</span>
              Attendance Tracking
            </div>

            <div className="feature">
              <span>✓</span>
              Real-Time Dashboard
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-form-section">
          <div className="form-header">
            <div className="mobile-logo">✓</div>

            <h2>Welcome Back</h2>

            <p>Sign in to manage employee attendance</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="input-group">
              <label htmlFor="username">Username</label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({
                      ...errors,
                      username: "",
                    });
                  }}
                />
              </div>

              {errors.username && (
                <p className="error-message">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({
                      ...errors,
                      password: "",
                    });
                  }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p className="footer-text">Mini Attendance Management System</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
