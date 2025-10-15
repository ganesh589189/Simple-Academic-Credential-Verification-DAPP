// src/components/AddStudent.jsx
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import { useNavigate } from "react-router-dom";

// Update the contract address after re-deploying the smart contract
const contractAddress = "0x24fEb191a3E56D5f6cd89A5A4BE9eC92E9c99b03"; 

function AddStudent() {
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [form, setForm] = useState({ studentId: "", name: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initContract = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const signer = await provider.getSigner();
                const cred = new Contract(contractAddress, abi.abi, signer);
                setContract(cred);
            } catch (error) {
                console.error("Error initializing contract:", error);
                alert("Please connect your MetaMask wallet.");
            }
        };
        initContract();
    }, []);

    const handleRegister = async () => {
        if (!contract || !form.studentId || !form.name || !form.password) {
            alert("Please fill all fields.");
            return;
        }

        setIsLoading(true);

        // Hash the password for secure storage on the blockchain
        const passwordHash = keccak256(toUtf8Bytes(form.password));

        try {
            const tx = await contract.registerStudent(form.studentId, form.name, passwordHash);
            await tx.wait();
            alert(`Student "${form.name}" registered successfully with ID: ${form.studentId}!`);
            setForm({ studentId: "", name: "", password: "" });
            navigate('/admin/view-students'); // Redirect to view students page
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. See console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3>Add New Student</h3>
            <p>
                This form registers a new student on the blockchain. The password is **hashed** for security.
            </p>
            <input 
                placeholder="Student ID"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                disabled={isLoading}
            />
            <input 
                placeholder="Student Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isLoading}
            />
            <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={isLoading}
            />
            <button onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register Student'}
            </button>
        </>
    );
}

export default AddStudent;