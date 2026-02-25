import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addWorkshop } from "../services/api";

function AddWorkshop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", date: "", time: "", period: "AM", instructor: "", seats: 20, description: "", meetingLink: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullTime = `${formData.time} ${formData.period}`;
    addWorkshop({ ...formData, time: fullTime, registered: 0 }).then(() => {
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
                <div style={{display: 'flex', gap: '8px'}}>
                  <input name="time" type="time" required onChange={handleChange} style={{...styles.input, flex: 2}} />
                  <select name="period" value={formData.period} onChange={handleChange} style={{...styles.input, flex: 1}}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Instructor Name</label>
                <input name="instructor" placeholder="e.g., John Doe" required onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Available Seats</label>
                <select name="seats" value={formData.seats} onChange={handleChange} style={styles.input}>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea name="description" placeholder="Describe the workshop..." required onChange={handleChange} style={styles.textarea} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Meeting Link (Optional - Add later for today's sessions)</label>
              <input name="meetingLink" type="url" placeholder="https://meet.google.com/xxx-xxxx-xxx" onChange={handleChange} style={styles.input} />
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
