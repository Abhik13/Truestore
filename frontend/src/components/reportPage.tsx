import { auth, logout } from "../firebase";
import "../styles.css";
import { useUser } from "../uderContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";




import homeicon from '../images/home.png'
import valicon from '../images/report.png'
import val2icon from '../images/validate.png'


const Report = () => {
  const { userData } = useUser();
  const [vehicleId, setVehicleId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  
  // Handle File Selection}
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 🚀 Implement API call to upload data
    // upload to ipfs
    // try {
      const formData = new FormData();
      formData.append("file", file || "no_file"); // ✅ Attach the file
      formData.append("submittedBy", userData?.user_id || "unknown_user");
      try {
        const response = await axios.post("http://localhost:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ Important for file uploads
          },

          
          
        });

        console.log("check id", response.data);
        await axios.post("http://localhost:5000/api/report/details", {
          report_id: response.data.report_id,
          vehicle_id: vehicleId,
          location,
          description,
        });
    
        console.log("✅ Report Uploaded:", response.data);
    
        if (response.data.success) {
          alert(`Report submitted!`);
        } else {
          alert("❌ Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("❌ Error uploading report:", error);
        alert("Upload failed. Check console for details.");
      }

      

    // 

    // Reset form after submission
    setVehicleId("");
    setLocation("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <ul className="nav-links">
          <li><a href="/home"><img src={homeicon} alt="Home" className="sidebar-icon" /> Home</a></li>
          <li><a href="/report"><img src={valicon} alt="Report" className="sidebar-icon" /> Report</a></li>
          <li><a href="/validate"><img src={val2icon} alt="Validate" className="sidebar-icon" /> Validate</a></li>
        </ul>
        <button onClick={logout} className="logout-btn">Logout</button>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard">
        <div className="welcome-container">
          <h1>Welcome, {userData?.name || "User"} 👋</h1>
          <p className="token">Token Balance: {userData?.tokens}</p>
        </div>

        {/* 🚀 Report Incident Form */}
        <div className="card-report">
          <h3>📢 Report an Incident</h3>
          <form onSubmit={handleSubmit}>
            {/* Vehicle ID */}
            <input 
              type="text" 
              placeholder="Vehicle ID" 
              value={vehicleId} 
              onChange={(e) => setVehicleId(e.target.value)} 
              required 
            />

            {/* Location */}
            <input 
              type="text" 
              placeholder="Location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />

            {/* Description */}
            <input
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />

            {/* File Upload */}
            <input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
              required
            />
            {file && <p>Selected file: {file.name}</p>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn">Submit Report</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Report;