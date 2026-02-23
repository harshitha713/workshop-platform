import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops, registerForWorkshop } from "../services/api";

function UserDashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([1]);
  const [attendedWorkshops] = useState([1]);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({ userName: "", email: "" });

  useEffect(() => {
    getWorkshops().then(setWorkshops);
  }, []);

  const myWorkshops = workshops.filter(w => registeredWorkshops.includes(w.id));
  const availableWorkshops = workshops.filter(w => !registeredWorkshops.includes(w.id)).slice(0, 2);
  const attendedSessions = workshops.filter(w => attendedWorkshops.includes(w.id));

  const handleRegisterClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowModal(true);
  };

  const handleConfirmRegister = (e) => {
    e.preventDefault();
    registerForWorkshop({ 
      workshopId: selectedWorkshop.id, 
      userName: formData.userName, 
      email: formData.email, 
      registeredAt: new Date().toISOString().split('T')[0] 
    }).then(() => {
      setRegisteredWorkshops([...registeredWorkshops, selectedWorkshop.id]);
      setShowModal(false);
      setFormData({ userName: "", email: "" });
      alert(`Successfully registered for "${selectedWorkshop.title}"!`);
    });
  };

  return (
    <div style={styles.wrapper}>
      <Navbar role="user" />
      <div style={styles.container}>
        <h2 style={styles.title}>User Dashboard</h2>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{registeredWorkshops.length}</div>
            <div style={styles.statLabel}>Registered Workshops</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{workshops.filter(w => !registeredWorkshops.includes(w.id)).length}</div>
            <div style={styles.statLabel}>Available Workshops</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{attendedWorkshops.length}</div>
            <div style={styles.statLabel}>Attended Sessions</div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>My Registered Workshops</h3>
          {myWorkshops.length > 0 ? (
            <div style={styles.workshopGrid}>
              {myWorkshops.map(w => (
                <div key={w.id} style={styles.workshopCard}>
                  <span style={styles.badge}>Registered</span>
                  <h4 style={styles.workshopTitle}>{w.title}</h4>
                  <p style={styles.metaText}>Date: {w.date}</p>
                  <p style={styles.metaText}>Time: {w.time}</p>
                  <p style={styles.metaText}>Instructor: {w.instructor}</p>
                  <Link to={`/user/workshop/${w.id}`}>
                    <button style={styles.detailsBtn}>View Details</button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>You haven't registered for any workshops yet</p>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Available Workshops</h3>
          <div style={styles.workshopGrid}>
            {availableWorkshops.map(w => (
              <div key={w.id} style={styles.workshopCard}>
                <h4 style={styles.workshopTitle}>{w.title}</h4>
                <p style={styles.metaText}>Date: {w.date}</p>
                <p style={styles.metaText}>Time: {w.time}</p>
                <p style={styles.metaText}>Instructor: {w.instructor}</p>
                <p style={styles.metaText}>Seats: {w.seats - w.registered}/{w.seats} available</p>
                <button onClick={() => handleRegisterClick(w)} style={styles.registerBtn}>Register Now</button>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Attended Sessions</h3>
          {attendedSessions.length > 0 ? (
            <div style={styles.workshopGrid}>
              {attendedSessions.map(w => (
                <div key={w.id} style={styles.workshopCard}>
                  <span style={styles.badgeAttended}>Attended</span>
                  <h4 style={styles.workshopTitle}>{w.title}</h4>
                  <p style={styles.metaText}>Date: {w.date}</p>
                  <p style={styles.metaText}>Time: {w.time}</p>
                  <p style={styles.metaText}>Instructor: {w.instructor}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No attended sessions yet</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Register for Workshop</h3>
            <p style={styles.modalSubtitle}>{selectedWorkshop?.title}</p>
            <form onSubmit={handleConfirmRegister}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                  style={styles.input}
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  style={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "1300px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", marginBottom: "28px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "32px" },
  statCard: { background: "white", borderRadius: "8px", padding: "20px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "3px solid #1976d2" },
  statNumber: { fontSize: "32px", fontWeight: "700", color: "#1976d2", marginBottom: "6px" },
  statLabel: { fontSize: "16px", color: "#000", fontWeight: "500" },
  section: { marginBottom: "32px" },
  sectionTitle: { color: "#333", fontSize: "18px", fontWeight: "600", marginBottom: "16px" },
  workshopGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" },
  workshopCard: { background: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #e8eef5" },
  badge: { background: "#1976d2", color: "white", padding: "4px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", display: "inline-block", marginBottom: "10px" },
  badgeAttended: { background: "#4caf50", color: "white", padding: "4px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", display: "inline-block", marginBottom: "10px" },
  workshopTitle: { fontSize: "18px", fontWeight: "600", color: "#333", marginBottom: "10px", marginTop: "0" },
  metaText: { fontSize: "16px", color: "#000", margin: "4px 0" },
  detailsBtn: { width: "100%", padding: "11px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px", marginTop: "10px" },
  registerBtn: { width: "100%", padding: "11px", background: "#4caf50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px", marginTop: "10px" },
  emptyState: { background: "white", borderRadius: "8px", padding: "40px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  emptyText: { fontSize: "17px", color: "#000" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "white", borderRadius: "8px", width: "90%", maxWidth: "450px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" },
  modalTitle: { margin: "0 0 8px 0", fontSize: "22px", fontWeight: "600", color: "#333" },
  modalSubtitle: { fontSize: "17px", color: "#000", marginBottom: "20px" },
  formGroup: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "16px", fontWeight: "600", color: "#333" },
  input: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px" },
  cancelBtn: { flex: 1, padding: "12px", background: "#f5f5f5", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px" },
  confirmBtn: { flex: 1, padding: "12px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "16px" }
};

export default UserDashboard;
