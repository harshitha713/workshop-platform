import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshopById, registerForWorkshop } from "../services/api";

function WorkshopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([1, 2]);
  const isRegistered = registeredWorkshops.includes(parseInt(id));

  useEffect(() => {
    getWorkshopById(id).then(setWorkshop);
  }, [id]);

  const handleRegister = () => {
    registerForWorkshop({ 
      workshopId: id, 
      userName: "Current User", 
      email: "user@example.com", 
      registeredAt: new Date().toISOString().split('T')[0] 
    }).then(() => {
      setRegisteredWorkshops([...registeredWorkshops, parseInt(id)]);
      alert(`Successfully registered for "${workshop.title}"!`);
      navigate("/user");
    });
  };

  if (!workshop) return <div style={styles.loading}>Loading...</div>;

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
              <span style={styles.infoValue}>{workshop.date}</span>
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

          {isRegistered ? (
            <button style={styles.registeredBtn} disabled>
              Already Registered
            </button>
          ) : (
            <button onClick={handleRegister} style={styles.registerBtn} disabled={workshop.registered >= workshop.seats}>
              {workshop.registered >= workshop.seats ? "Workshop Full" : "Register for this Workshop"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
  registerBtn: { width: "100%", padding: "12px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
  registeredBtn: { width: "100%", padding: "12px", background: "#4caf50", color: "white", border: "none", borderRadius: "6px", cursor: "not-allowed", fontSize: "15px", fontWeight: "600" }
};

export default WorkshopDetails;
