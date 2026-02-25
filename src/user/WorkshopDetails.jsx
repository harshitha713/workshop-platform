import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshopById, getRegistrations, registerForWorkshop, cancelRegistration } from "../services/api";

function WorkshopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = "Current User";

  useEffect(() => {
  loadData();
}, [loadData]);

  const loadData = async () => {
    setLoading(true);
    const [w, r] = await Promise.all([getWorkshopById(id), getRegistrations()]);
    setWorkshop(w);
    setRegistrations(r);
    setLoading(false);
  };

  const isRegistered = registrations.some(r => r.workshopId === parseInt(id) && r.userName === currentUser);

  const isWorkshopToday = (workshopDate) => {
    const today = new Date();
    const wDate = new Date(workshopDate);
    today.setHours(0, 0, 0, 0);
    wDate.setHours(0, 0, 0, 0);
    return today.getTime() === wDate.getTime();
  };

  const isSessionStarted = (workshopDate, workshopTime) => {
    if (!isWorkshopToday(workshopDate)) return false;
    const now = new Date();
    const [time, period] = workshopTime.split(' ');
    const [hours, minutes] = time.split(':');
    let sessionHour = parseInt(hours);
    if (period === 'PM' && sessionHour !== 12) sessionHour += 12;
    if (period === 'AM' && sessionHour === 12) sessionHour = 0;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return currentHour > sessionHour || (currentHour === sessionHour && currentMinute >= parseInt(minutes));
  };

  const handleRegister = async () => {
    if (workshop.registered >= workshop.seats) {
      alert("Workshop is full");
      return;
    }
    try {
      await registerForWorkshop({ workshopId: parseInt(id), userName: currentUser, email: "user@example.com" });
      alert("Registration successful");
      loadData();
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  const handleCancel = async () => {
    if (window.confirm(`Cancel registration for "${workshop.title}"?`)) {
      try {
        await cancelRegistration(parseInt(id), currentUser);
        alert("Registration cancelled");
        navigate("/user");
      } catch (err) {
        alert("Failed to cancel registration");
      }
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!workshop) return <div style={styles.loading}>Workshop not found</div>;

  return (
    <div style={styles.wrapper}>
      <Navbar role="user" />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>{workshop.title}</h1>
            <span style={styles.badge}>
              {workshop.seats - workshop.registered > 0 ? `${workshop.seats - workshop.registered} seats available` : "Fully Booked"}
            </span>
          </div>
          
          <p style={styles.description}>{workshop.description}</p>
          
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Date:</span>
              <span style={styles.infoValue}>{formatDate(workshop.date)}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Time:</span>
              <span style={styles.infoValue}>{workshop.time}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Instructor:</span>
              <span style={styles.infoValue}>{workshop.instructor}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Capacity:</span>
              <span style={styles.infoValue}>{workshop.registered}/{workshop.seats}</span>
            </div>
          </div>

          {isRegistered && workshop.meetingLink && isSessionStarted(workshop.date, workshop.time) ? (
            <div style={styles.meetingSection}>
              <h3 style={styles.meetingTitle}>Join Online Session</h3>
              <p style={styles.meetingText}>Click the button below to join the live workshop session</p>
              <a href={workshop.meetingLink} target="_blank" rel="noopener noreferrer" style={styles.joinBtn}>
                Join Session Now
              </a>
            </div>
          ) : isRegistered && isWorkshopToday(workshop.date) && !isSessionStarted(workshop.date, workshop.time) ? (
            <div style={styles.infoSection}>
              <p style={styles.sessionInfo}>Session starts at {workshop.time}</p>
              <p style={styles.linkMessage}>Please wait until session time to join</p>
            </div>
          ) : isRegistered && workshop.meetingLink ? (
            <div style={styles.infoSection}>
              <p style={styles.sessionInfo}>Session link will be available on workshop day</p>
            </div>
          ) : isRegistered ? (
            <div style={styles.infoSection}>
              <p style={styles.linkMessage}>Session link not yet added by admin</p>
            </div>
          ) : null}

          <div style={styles.btnRow}>
            {isRegistered ? (
              <button onClick={handleCancel} style={styles.cancelBtn}>
                Cancel Registration
              </button>
            ) : (
              <button onClick={handleRegister} style={styles.registerBtn} disabled={workshop.registered >= workshop.seats}>
                {workshop.registered >= workshop.seats ? "Workshop Full" : "Register for this Workshop"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "900px", margin: "0 auto" },
  loading: { color: "#666", textAlign: "center", padding: "100px", fontSize: "18px" },
  card: { background: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1976d2", margin: 0, flex: 1 },
  badge: { background: "#e3f2fd", color: "#1976d2", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", marginLeft: "16px" },
  description: { fontSize: "15px", color: "#666", marginBottom: "24px", lineHeight: "1.6" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px", padding: "20px", background: "#f8f9fa", borderRadius: "8px" },
  infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel: { fontSize: "12px", color: "#666", fontWeight: "600" },
  infoValue: { fontSize: "15px", fontWeight: "600", color: "#333" },
  meetingSection: { background: "#f0f7ff", padding: "24px", borderRadius: "8px", marginBottom: "24px", border: "2px solid #1976d2" },
  meetingTitle: { fontSize: "20px", fontWeight: "700", color: "#1976d2", margin: "0 0 8px 0" },
  meetingText: { fontSize: "14px", color: "#666", marginBottom: "16px" },
  joinBtn: { display: "inline-block", padding: "14px 32px", background: "#4caf50", color: "white", textDecoration: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", transition: "background 0.2s" },
  infoSection: { background: "#e3f2fd", padding: "20px", borderRadius: "8px", marginBottom: "24px", textAlign: "center" },
  sessionInfo: { fontSize: "16px", fontWeight: "600", color: "#1976d2", margin: "0 0 8px 0" },
  linkMessage: { fontSize: "14px", color: "#666", margin: 0 },
  btnRow: { display: "flex", gap: "12px" },
  registerBtn: { width: "100%", padding: "12px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
  cancelBtn: { width: "100%", padding: "12px", background: "#f44336", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px", fontWeight: "600" }
};

export default WorkshopDetails;
