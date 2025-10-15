import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import { useNavigate } from "react-router-dom";
import "./Employee.css";

const contractAddress = "0x24fEb191a3E56D5f6cd89A5A4BE9eC92E9c99b03";

function Employee() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ employeeId: "", password: "" });
  const [verifyHash, setVerifyHash] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  const handleLogin = () => {
    if (loginForm.employeeId === "emp1" && loginForm.password === "emp@1") {
      setIsLoggedIn(true);
      initContract();
    } else {
      alert("Invalid Credentials ❌\n\nDefault Login:\nEmployee ID: EMP001\nPassword: employee123");
    }
  };

  const initContract = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      const cred = new Contract(contractAddress, abi.abi, signer);
      setContract(cred);
    } catch (error) {
      console.error("Error connecting to blockchain:", error);
      alert("Please connect your MetaMask wallet");
    }
  };

  const handleVerify = async () => {
    if (!verifyHash || !verifyHash.startsWith('0X')) {
      alert("Please enter a valid blockchain hash (starting with 0x) to verify");
      return;
    }

    if (!contract) {
      alert("Please ensure MetaMask is connected");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const credentialData = await contract.getCredentialByHash(verifyHash);

      if (credentialData.studentId && credentialData.studentId !== "") {
        setVerificationResult({
          success: true,
          message: "Certificate Authenticated Successfully!",
          data: {
            studentId: credentialData.studentId,
            name: credentialData.name,
            branch: credentialData.branch,
            dept: credentialData.dept,
            cgpa: credentialData.cgpa,
            issuedDate: credentialData.issuedDate,
            hash: verifyHash,
            issuer: credentialData.issuer
          },
        });
      } else {
        setVerificationResult({
          success: false,
          message: "Certificate Not Found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        message: "Verification Failed - Blockchain Error",
        data: null,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    setVerifyHash("");
    setVerificationResult(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ employeeId: "", password: "" });
    setVerifyHash("");
    setVerificationResult(null);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="employee-container">
        <div className="employee-login-box">
          <div className="login-header">
            <div className="company-logo">🏢</div>
            <h2>Employee Verification Portal</h2>
            <p className="login-subtitle">Corporate Credential Verification System</p>
          </div>
          <div className="login-form">
            <div className="input-group">
              <label>Employee ID</label>
              <input
                type="text"
                placeholder="Enter Employee ID"
                value={loginForm.employeeId}
                onChange={(e) => setLoginForm({ ...loginForm, employeeId: e.target.value })}
              />
              <span className="input-icon">👤</span>
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <span className="input-icon">🔒</span>
            </div>
            <button className="login-button" onClick={handleLogin}>
              <span>Login to Verify</span>
              <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-panel">
        <div className="panel-header">
          <div className="header-left">
            <div className="company-badge">🏢</div>
            <div>
              <h2>Credential Verification Center</h2>
              <p className="header-subtitle">Bridging Universities & Organizations</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="verification-section">
          <div className="section-title">
            <span className="title-icon">🔍</span>
            <h3>Verify Academic Credentials</h3>
          </div>
          <div className="verification-form">
            <div className="hash-input-container">
              <label>Certificate Hash</label>
              <input
                type="text"
                placeholder="Enter Certificate Hash (e.g., 0x...)"
                value={verifyHash}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only convert to uppercase if the value doesn't start with '0x'
                  if (value.startsWith('0x')) {
                    setVerifyHash('0x' + value.slice(2).toUpperCase());
                  } else {
                    setVerifyHash(value.toUpperCase());
                  }
                }}
                className="hash-input"
                disabled={isVerifying}
              />
            </div>
            <div className="verification-actions">
              <button 
                className="verify-button" 
                onClick={handleVerify}
                disabled={!verifyHash || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <span className="spinner"></span>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>🔐 Verify on Blockchain</span>
                  </>
                )}
              </button>
              <button 
                className="clear-button" 
                onClick={handleClear}
                disabled={isVerifying}
              >
                Clear
              </button>
            </div>
          </div>
          {verificationResult && (
            <div className={`verification-result ${verificationResult.success ? 'success' : 'failure'}`}>
              <div className="result-icon">
                {verificationResult.success ? '✓' : '✗'}
              </div>
              <div className="result-content">
                <h4>{verificationResult.message}</h4>
                {verificationResult.success && verificationResult.data ? (
                  <div className="certificate-details">
                    <div className="detail-row">
                      <span className="detail-label">Student ID:</span>
                      <span className="detail-value">{verificationResult.data.studentId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{verificationResult.data.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Branch:</span>
                      <span className="detail-value">{verificationResult.data.branch}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Degree:</span>
                      <span className="detail-value">{verificationResult.data.dept}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">CGPA:</span>
                      <span className="detail-value">{verificationResult.data.cgpa}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Issue Date:</span>
                      <span className="detail-value">{verificationResult.data.issuedDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Hash:</span>
                      <span className="detail-value hash-value">{verificationResult.data.hash}</span>
                    </div>
                    <div className="blockchain-badge">
                      <span className="badge-icon">⛓️</span>
                      <span>Verified on Blockchain</span>
                    </div>
                  </div>
                ) : (
                  <div className="failure-message">
                    <p>This certificate hash does not exist in our blockchain records.</p>
                    <p className="failure-hint">Please verify the hash and try again.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="info-cards">
          <div className="info-card">
            <div className="card-icon">🎓</div>
            <h4>University Partner</h4>
            <p>Verified credentials from accredited institutions</p>
          </div>
          <div className="info-card">
            <div className="card-icon">🔗</div>
            <h4>Blockchain Security</h4>
            <p>Immutable and tamper-proof verification</p>
          </div>
          <div className="info-card">
            <div className="card-icon">🏢</div>
            <h4>Corporate Trust</h4>
            <p>Trusted verification for hiring decisions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;