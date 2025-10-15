import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Blockchain Academic Credential Verification</h1>
      <p>Securely verify academic credentials using Blockchain & Smart Contracts</p>

      <div className="login-buttons">
        <button onClick={() => navigate("/student")}>Student Login</button>
        <button onClick={() => navigate("/employee")}>Employee Login</button>
        <button onClick={() => navigate("/admin")}>Admin Login</button>
      </div>
    </div>
  );
}

export default Home;