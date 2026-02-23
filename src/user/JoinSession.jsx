import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops } from "../services/api";

function JoinSession() {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    getWorkshops().then(setWorkshops);
  }, []);

  return (
    <div style={styles.wrapper}>
      <Navbar role="user" />
      <div style={styles.container}>
        <h2 style={styles.title}>Available Workshops</h2>
        <p style={styles.subtitle}>Explore and register for upcoming training sessions</p>
        
        <div style={styles.grid}>
          {workshops.map(w => (
            <div key={w.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.workshopTitle}>{w.title}</h3>
                <span style={w.seats - w.registered > 10 ? styles.badgeAvailable : styles.badgeLimited}>
                  {w.seats - w.registered} seats left
                </span>
              </div>
              <p style={styles.description}>{w.description}</p>
              <div style={styles.metaGrid}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Date:</span>
                  <span style={styles.metaValue}>{w.date}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Time:</span>
                  <span style={styles.metaValue}>{w.time}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Instructor:</span>
                  <span style={styles.metaValue}>{w.instructor}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Registered:</span>
                  <span style={styles.metaValue}>{w.registered}/{w.seats}</span>
                </div>
              </div>
              <Link to={`/user/workshop/${w.id}`}>
                <button style={styles.registerBtn}>View Details & Register</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "1300px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0" },
  subtitle: { color: "#666", fontSize: "14px", marginBottom: "28px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" },
  card: { background: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #e8eef5" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  workshopTitle: { fontSize: "18px", fontWeight: "600", color: "#333", margin: 0, flex: 1 },
  badgeAvailable: { background: "#e8f5e9", color: "#4caf50", padding: "4px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", marginLeft: "12px" },
  badgeLimited: { background: "#fff3e0", color: "#ff9800", padding: "4px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", marginLeft: "12px" },
  description: { fontSize: "13px", color: "#666", marginBottom: "16px", lineHeight: "1.5" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px", paddingTop: "16px", borderTop: "1px solid #f0f0f0" },
  metaItem: { display: "flex", flexDirection: "column", gap: "2px" },
  metaLabel: { fontSize: "11px", color: "#999", fontWeight: "600" },
  metaValue: { fontSize: "13px", color: "#333", fontWeight: "500" },
  registerBtn: { width: "100%", padding: "10px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }
};

export default JoinSession;
