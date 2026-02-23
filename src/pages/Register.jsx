import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Dummy success (backend later)
    alert("Registration successful!");
    navigate("/");
  };

  return (
    <div className="register">
      <h1 className="title">User Sign Up</h1>
      <p className="tagline">Create your Online Workshop Platform account</p>

      <div className="register-card">
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          <button type="submit">Sign Up</button>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;