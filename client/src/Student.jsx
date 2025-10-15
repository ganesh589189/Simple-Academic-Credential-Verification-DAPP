// src/components/Student.jsx
import { useState } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import { useNavigate } from "react-router-dom";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import "./Student.css";

const contractAddress = "0x24fEb191a3E56D5f6cd89A5A4BE9eC92E9c99b03";

function Student() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ studentId: "", password: "" });
    const [studentData, setStudentData] = useState(null);
    const [issuedCertificates, setIssuedCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contract, setContract] = useState(null);

    const initContract = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = await provider.getSigner();
            const cred = new Contract(contractAddress, abi.abi, signer);
            setContract(cred);
            return cred;
        } catch (error) {
            console.error("Error connecting to blockchain:", error);
            alert("Please connect your MetaMask wallet");
            return null;
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        const credContract = await initContract();
        if (!credContract) {
            setIsLoading(false);
            return;
        }

        try {
            const enteredPasswordHash = keccak256(toUtf8Bytes(loginForm.password));
            const loginSuccess = await credContract.studentLogin(loginForm.studentId, enteredPasswordHash);

            if (loginSuccess) {
                const [id, name] = await credContract.getStudent(loginForm.studentId);
                setStudentData({ id, name });

                const hashes = await credContract.getIssuedHashes();
                const studentCerts = [];

                for (const hash of hashes) {
                    const cert = await credContract.getCredentialByHash(hash);
                    if (cert.studentId === loginForm.studentId) {
                        studentCerts.push({
                            studentId: cert.studentId,
                            name: cert.name,
                            branch: cert.branch,
                            dept: cert.dept,
                            cgpa: cert.cgpa,
                            // Change `cert.file` to `cert.ipfsHash` to get the IPFS link
                            file: cert.ipfsHash, 
                            issuedDate: cert.issuedDate,
                            hash: hash
                        });
                    }
                }
                setIssuedCertificates(studentCerts);
                setIsLoggedIn(true);
            } else {
                alert("Invalid Student ID or Password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoginForm({ studentId: "", password: "" });
        setStudentData(null);
        setIssuedCertificates([]);
        navigate("/");
    };

    // Student Login Form
    if (!isLoggedIn) {
        return (
            <div className="student-container">
                <div className="student-login-box">
                    <h2>Student Login</h2>
                    <input
                        placeholder="Student ID"
                        value={loginForm.studentId}
                        onChange={(e) => setLoginForm({ ...loginForm, studentId: e.target.value })}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                </div>
            </div>
        );
    }

    // Student Dashboard
    return (
        <div className="student-container">
            <div className="student-dashboard-box">
                <div className="dashboard-header">
                    <h2>Welcome, {studentData.name}!</h2>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
                
                <h3>Your Issued Certificates</h3>
                
                {issuedCertificates.length === 0 ? (
                    <p className="no-certificates-message">You do not have any certificates issued to your account yet.</p>
                ) : (
                    issuedCertificates.map((rec, idx) => (
                        <div key={idx} className="certificate-card">
                            <p><strong>Student ID:</strong> {rec.studentId}</p>
                            <p><strong>Name:</strong> {rec.name}</p>
                            <p><strong>Branch:</strong> {rec.branch}</p>
                            <p><strong>Degree:</strong> {rec.dept}</p>
                            <p><strong>CGPA:</strong> {rec.cgpa}</p>
                            <p><strong>Date:</strong> {rec.issuedDate}</p>
                            
                            <div className="hash-container">
                                <strong>Hash:</strong> 
                                <span className="hash-value">{rec.hash}</span>
                            </div>

                            <div className="card-buttons">
                                {rec.file && (
                                    <button
                                        onClick={() => {
                                            // Construct the IPFS gateway URL
                                            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${rec.file}`;
                                            window.open(ipfsUrl, '_blank');
                                        }}
                                        className="card-action-button"
                                    >
                                        View File
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(rec.hash);
                                        alert("Hash copied!");
                                    }}
                                    className="copy-button"
                                >
                                    Copy Hash
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Student;