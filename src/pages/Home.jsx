import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    role === "user" ? navigate("/user") : navigate("/admin");
  };

  return (
    <div className="home">
      <h1 className="title" style={{color: "#c62828"}}>Online Workshop Platform</h1>
      <p className="tagline" style={{color: "#000"}}>
        Online Workshop & Training Management Platform
      </p>

      <div className="card">
        <form className="card-body" onSubmit={handleLogin}>

          {/* ROLE SELECTION */}
          <div className="role-switch">
            <button
              type="button"
              className={role === "user" ? "active" : ""}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <h2>{role === "user" ? "User Login" : "Admin Login"}</h2>

          <input
            type="text"
            placeholder={role === "user" ? "Email / Username" : "Admin ID"}
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit">Login</button>

          {role === "user" && (
            <p className="signup">
              Don’t have an account?{" "}
              <Link to="/register" className="signup-link">
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Home;