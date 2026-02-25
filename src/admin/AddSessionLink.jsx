import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops } from "../services/api";

function AddSessionLink() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getWorkshops().then(setWorkshops);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Session link added for workshop ID: ${selectedWorkshop}`);
    setSelectedWorkshop("");
    setMeetingLink("");
  };

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>Add Session Link</h2>
        <p style={styles.subtitle}>Add meeting links to your workshops</p>

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Workshop</label>
              <select
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
                required
                style={styles.select}
              >
                <option value="">Choose a workshop...</option>
                {workshops.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.title} - {w.date}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Meeting Link</label>
              <input
                type="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="button" onClick={() => navigate("/admin")} style={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" style={styles.submitBtn}>
                Add Link
              </button>
            </div>
          </form>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Available Workshops</h3>
          <div style={styles.workshopGrid}>
            {workshops.map(w => (
              <div key={w.id} style={styles.workshopCard}>
                <h4 style={styles.workshopTitle}>{w.title}</h4>
                <p style={styles.metaText}>Date: {w.date}</p>
                <p style={styles.metaText}>Time: {w.time}</p>
                <p style={styles.metaText}>Instructor: {w.instructor}</p>
                <p style={styles.metaText}>Seats: {w.registered}/{w.seats}</p>
                {w.meetingLink ? (
                  <p style={styles.linkStatus}>✓ Link Added</p>
                ) : (
                  <p style={styles.noLinkStatus}>No Link</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "1300px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0" },
  subtitle: { color: "#000", fontSize: "18px", marginBottom: "28px", marginTop: "6px" },
  card: { background: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "32px" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontSize: "16px", fontWeight: "600", color: "#333" },
  select: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box" },
  input: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box" },
  buttonGroup: { display: "flex", gap: "12px", marginTop: "28px" },
  cancelBtn: { flex: 1, padding: "12px", background: "#f5f5f5", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px" },
  submitBtn: { flex: 1, padding: "12px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px" },
  section: { marginBottom: "32px" },
  sectionTitle: { color: "#333", fontSize: "18px", fontWeight: "600", marginBottom: "16px" },
  workshopGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" },
  workshopCard: { background: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #e8eef5" },
  workshopTitle: { fontSize: "18px", fontWeight: "600", color: "#333", marginBottom: "10px", marginTop: "0" },
  metaText: { fontSize: "16px", color: "#000", margin: "4px 0" },
  linkStatus: { fontSize: "14px", color: "#4caf50", margin: "12px 0 0 0", fontWeight: "600" },
  noLinkStatus: { fontSize: "14px", color: "#999", margin: "12px 0 0 0", fontWeight: "600" }
};

export default AddSessionLink;
