import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshopById, updateWorkshop } from "../services/api";

function EditWorkshop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    period: "AM",
    instructor: "",
    seats: "20",
    description: "",
    meetingLink: "",
  });

  const loadWorkshop = useCallback(async () => {
    try {
      const workshop = await getWorkshopById(id);
      const [time, period] = workshop.time.split(" ");

      setFormData({
        title: workshop.title,
        date: workshop.date,
        time: time,
        period: period || "AM",
        instructor: workshop.instructor,
        seats: workshop.seats.toString(),
        description: workshop.description,
        meetingLink: workshop.meetingLink || "",
      });

      setLoading(false);
    } catch (err) {
      alert("Failed to load workshop");
      navigate("/admin");
    }
  }, [id, navigate]);

  useEffect(() => {
    loadWorkshop();
  }, [loadWorkshop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateWorkshop(id, {
        ...formData,
        time: `${formData.time} ${formData.period}`,
        seats: parseInt(formData.seats),
      });

      alert("Workshop updated successfully");
      navigate("/admin");
    } catch (err) {
      alert("Failed to update workshop");
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>Edit Workshop</h2>
        <p style={styles.subtitle}>Update workshop details</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Workshop Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              style={styles.input}
              required
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Time</label>
              <div style={styles.timeRow}>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  style={{ ...styles.input, flex: 1 }}
                  required
                />
                <select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  style={{ ...styles.input, width: "80px" }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Instructor</label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Seats</label>
              <select
                value={formData.seats}
                onChange={(e) =>
                  setFormData({ ...formData, seats: e.target.value })
                }
                style={styles.input}
                required
              >
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
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Meeting Link (Optional)</label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData({ ...formData, meetingLink: e.target.value })
              }
              style={styles.input}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.submitBtn}>
              Update Workshop
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "800px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0" },
  subtitle: { color: "#000", fontSize: "18px", marginBottom: "28px", marginTop: "6px" },
  loading: { textAlign: "center", padding: "40px", fontSize: "18px", color: "#666" },
  form: { background: "white", padding: "32px", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  formGroup: { marginBottom: "20px", flex: 1 },
  row: { display: "flex", gap: "20px" },
  timeRow: { display: "flex", gap: "10px" },
  label: { display: "block", marginBottom: "8px", fontSize: "16px", fontWeight: "600", color: "#333" },
  input: { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", minHeight: "100px", boxSizing: "border-box" },
  buttonRow: { display: "flex", gap: "12px", marginTop: "24px" },
  submitBtn: { flex: 1, padding: "12px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "12px", background: "#666", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
};

export default EditWorkshop;