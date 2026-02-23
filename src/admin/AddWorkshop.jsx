import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addWorkshop } from "../services/api";

function AddWorkshop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", date: "", time: "", instructor: "", seats: "", description: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addWorkshop({ ...formData, registered: 0 }).then(() => {
      alert("✅ Workshop added successfully!");
      navigate("/admin");
    });
  };

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Add New Workshop</h1>
          <p style={styles.subtitle}>Create a new training session</p>
        </div>
        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Workshop Title</label>
              <input name="title" placeholder="e.g., React Fundamentals" required onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input name="date" type="date" required onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Time</label>
                <input name="time" type="time" required onChange={handleChange} style={styles.input} />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Instructor Name</label>
                <input name="instructor" placeholder="e.g., John Doe" required onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Available Seats</label>
                <input name="seats" type="number" placeholder="e.g., 30" required onChange={handleChange} style={styles.input} />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea name="description" placeholder="Describe the workshop..." required onChange={handleChange} style={styles.textarea} />
            </div>
            <button type="submit" style={styles.submitBtn}>Create Workshop</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "40px", maxWidth: "800px", margin: "0 auto" },
  header: { marginBottom: "24px" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0" },
  subtitle: { color: "#666", fontSize: "18px", margin: 0 },
  formCard: { background: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formGroup: { marginBottom: "20px", flex: 1 },
  label: { display: "block", marginBottom: "6px", fontSize: "17px", fontWeight: "600", color: "#333" },
  input: { width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px", fontFamily: "inherit", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px", minHeight: "100px", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" },
  row: { display: "flex", gap: "16px" },
  submitBtn: { width: "100%", padding: "13px", background: "#1976d2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "17px", marginTop: "8px" }
};

export default AddWorkshop;
