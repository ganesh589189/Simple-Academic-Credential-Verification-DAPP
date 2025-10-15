import { useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import "./Admin.css";

const contractAddress = "0x24fEb191a3E56D5f6cd89A5A4BE9eC92E9c99b03";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = () => {
    if (loginForm.username === "admin" && loginForm.password === "admin") {
      setIsLoggedIn(true);
      // No need to init contract here, the child components will handle it
      // but you can call it here if you want to pass the contract down via context
    } else {
      alert("Invalid Credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: "", password: "" });
    navigate("/"); // Redirect to home page
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="admin-box">
          <h2>Admin Login</h2>
          <input
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-box">
        <div className="admin-header-nav">
          <h2>Admin Panel</h2>
          <div className="admin-nav-buttons">
            <Link to="/admin/issue-certificate" className="nav-button">Issue Certificate</Link>
            <Link to="/admin/add-student" className="nav-button">Add Student</Link>
            <Link to="/admin/view-students" className="nav-button">View Students</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        
        {/* The Outlet component renders the nested route's component here */}
        <Outlet /> 
      </div>
    </div>
  );
}

export default Admin;