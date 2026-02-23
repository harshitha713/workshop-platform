import { Link, useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h2 style={styles.brandText}>Online Workshop Platform</h2>
        <div style={styles.links}>
          {role === "admin" ? (
            <>
              <Link to="/admin" style={styles.link}>Dashboard</Link>
              <Link to="/admin/add-workshop" style={styles.link}>Add Workshop</Link>
              <Link to="/admin/registrations" style={styles.link}>Registrations</Link>
              <Link to="/admin/upload-resources" style={styles.link}>Upload Resources</Link>
              <Link to="/admin/resources" style={styles.link}>View Resources</Link>
            </>
          ) : (
            <>
              <Link to="/user" style={styles.link}>Dashboard</Link>
              <Link to="/user/workshops" style={styles.link}>Workshops</Link>
              <Link to="/user/resources" style={styles.link}>Resources</Link>
            </>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 },
  container: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", maxWidth: "1400px", margin: "0 auto" },
  brandText: { margin: 0, color: "#000", fontWeight: "700", fontSize: "36px" },
  links: { display: "flex", gap: "28px", alignItems: "center" },
  link: { color: "#000", textDecoration: "none", fontWeight: "500", fontSize: "17px" },
  logoutBtn: { padding: "9px 20px", background: "#1976d2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "16px" }
};

export default Navbar;
