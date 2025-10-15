// src/components/IssueCertificate.jsx
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import "./Admin.css";
import axios from "axios";

const contractAddress = "0x24fEb191a3E56D5f6cd89A5A4BE9eC92E9c99b03"; 
// IPFS Pinata API Keys - Replace with your actual keys
const pinataApi = "8e46623444ae9e542309";
const pinataSecret = "fbdbf8bf3cf6b6ea4392397e322ae908442353821912c00c961af99170c80d79";

function IssueCertificate() {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    branch: "",
    dept: "",
    cgpa: "",
    date: "",
    file: null,
  });
  const [records, setRecords] = useState([]);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [verifyHash, setVerifyHash] = useState("");

  const generateCertificateHash = (studentId, name, cgpa, date, walletAddress) => {
    const dataString = `${studentId}-${name}-${cgpa}-${date}-${walletAddress}`;
    return keccak256(toUtf8Bytes(dataString));
  };

  const initContract = async () => {
    // Note: This logic should ideally be a reusable hook or passed from parent
    const provider = new BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const cred = new Contract(contractAddress, abi.abi, signer);
    setContract(cred);
    fetchRecords(cred, address);
  };

  useEffect(() => {
    initContract();
  }, []); // Run once on component mount

  const fetchRecords = async (contractInstance) => {
    try {
      const hashes = await contractInstance.getIssuedHashes();
      const allCredentials = [];

      for (const hash of hashes) {
        const cert = await contractInstance.getCredentialByHash(hash);
        allCredentials.push({
          studentId: cert.studentId,
          name: cert.name,
          branch: cert.branch,
          dept: cert.dept,
          cgpa: cert.cgpa,
          file: cert.ipfsHash,
          issuedDate: cert.issuedDate,
          hash: hash,
        });
      }

      setRecords(allCredentials);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation for PDF file type
    if (file.type !== "application/pdf") {
        alert("Please select a PDF file.");
        setForm({ ...form, file: null }); // Clear the file field
        return;
    }

    // We will not read the file into memory, just store the file object
    setForm({ ...form, file: file });
};

  const verifyCertificateHash = async (inputHash) => {
    if (!inputHash) {
      alert("Please enter a certificate hash");
      return;
    }

    if (!contract) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const credentialData = await contract.getCredentialByHash(inputHash);

      if (credentialData.studentId && credentialData.studentId !== "") {
        alert(
          `Certificate Verified!\n\nStudent: ${credentialData.name}\nID: ${credentialData.studentId}\nCGPA: ${credentialData.cgpa}\nDate: ${credentialData.issuedDate}\n\nThis certificate is authentic.`
        );
      } else {
        alert("Invalid Certificate Hash!\n\nThis hash does not exist in the blockchain records.");
      }
    } catch (error) {
      console.error("Blockchain verification error:", error);
      alert("An error occurred during verification. Check console for details.");
    }
  };

  const handleIssue = async () => {
    if (!contract || !form.file) {
        alert("Please fill all fields and upload a PDF file.");
        return;
    }

    try {
        // Step A: Upload file to IPFS via Pinata API
        const formData = new FormData();
        formData.append("file", form.file);

        const pinataResponse = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': pinataApi,
                    'pinata_secret_api_key': pinataSecret,
                }
            }
        );

        const ipfsHash = pinataResponse.data.IpfsHash; // This is the CID

        // Step B: Now, issue the credential with the IPFS hash instead of file data
        const tx = await contract.issueCredential(
            form.studentId || "",
            form.name || "",
            form.branch || "",
            form.dept || "",
            form.cgpa || "",
            ipfsHash, // Pass the IPFS hash (CID)
            form.date || ""
        );

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        const newHash = generateCertificateHash(form.studentId, form.name, form.cgpa, form.date, account);

        alert(`Certificate Issued Successfully!\n\nStudent: ${form.name}\nHash: ${newHash}\nIPFS Hash: ${ipfsHash}\n\nSave this hash!`);

        setForm({
            studentId: "",
            name: "",
            branch: "",
            dept: "",
            cgpa: "",
            date: "",
            file: null,
        });

        fetchRecords(contract, account);
    } catch (err) {
        console.error("Transaction failed:", err);
        if (err.code === 4001) {
            alert("Transaction rejected by user");
        } else if (err.code === -32603) {
            alert("Internal JSON-RPC error. Please try again.");
        } else if (err.message.includes("user rejected")) {
            alert("Transaction cancelled by user");
        } else {
            alert("Transaction failed: " + (err.reason || err.message));
        }
    }
  };

  return (
    <>
      <p>
        <strong>Connected Wallet:</strong> {account}
      </p>

      <h3>Issue Certificate</h3>
      <input
        placeholder="Student ID"
        value={form.studentId}
        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
      />
      {/* ... (All other form inputs) ... */}
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Branch"
        value={form.branch}
        onChange={(e) => setForm({ ...form, branch: e.target.value })}
      />
      <input
        placeholder="Degree"
        value={form.dept}
        onChange={(e) => setForm({ ...form, dept: e.target.value })}
      />
      <input
        placeholder="Final CGPA"
        value={form.cgpa}
        onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <input type="file" onChange={handleFileChange} />
      
      <button onClick={handleIssue}>Submit</button>

      <div className="certificate-verification-section">
    <h3>Verify Certificate Hash</h3>
    <div className="verification-form-container">
        <input
            type="text"
            className="hash-input"
            placeholder="Enter Certificate Hash"
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value.toUpperCase())}
        />
        <button 
            onClick={() => verifyCertificateHash(verifyHash)} 
            className="verify-button"
        >
            Verify
        </button>
    </div>
</div>
      
      <h3>Issued Certificates ({records.length})</h3>
      {records.length === 0 ? (
        <p>No certificates issued yet.</p>
      ) : (
        records.map((rec, idx) => (
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
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                {rec.file && (
                                    <button
    onClick={() => {
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
    </>
  );
}

export default IssueCertificate;