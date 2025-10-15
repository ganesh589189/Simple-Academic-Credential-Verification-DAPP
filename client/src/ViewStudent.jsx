// src/components/ViewStudents.jsx
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import "./Admin.css";

const contractAddress = "0x24fEb191a3E56D5f6cd89A5A4BE9eC92E9c99b03"; 

function ViewStudents() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [contract, setContract] = useState(null);
    const [editMode, setEditMode] = useState(null); // Stores the ID of the student being edited
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const cred = new Contract(contractAddress, abi.abi, signer);
                setContract(cred);
                
                const studentIds = await cred.getRegisteredStudentIds();
                const studentsList = await Promise.all(studentIds.map(async (id) => {
                    const [studentId, name, isRegistered] = await cred.getStudent(id);
                    // Fetch the password hash from the contract
                    const passwordHash = await cred.getStudentPasswordHash(id);
                    
                    return {
                        id: studentId,
                        name: name,
                        isRegistered: isRegistered,
                        passwordHash: passwordHash // Add password hash here
                    };
                }));
                
                setStudents(studentsList);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handlePasswordChange = async (studentId) => {
        if (!newPassword) {
            alert("Please enter a new password.");
            return;
        }

        if (!contract) {
            alert("Contract not initialized. Please refresh the page.");
            return;
        }
        
        setIsLoading(true);

        try {
            const newPasswordHash = keccak256(toUtf8Bytes(newPassword));
            
            // Call the smart contract function to update the password
            const tx = await contract.updateStudentPassword(studentId, newPasswordHash);
            await tx.wait();
            
            alert("Password updated successfully!");
            
            // Refresh the student list to show the updated hash
            const updatedStudents = students.map(student => 
                student.id === studentId ? { ...student, passwordHash: newPasswordHash } : student
            );
            setStudents(updatedStudents);
            
            setEditMode(null); // Exit edit mode
            setNewPassword(""); // Clear the password field

        } catch (error) {
            console.error("Failed to update password:", error);
            alert("Failed to update password. Please check console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3>Registered Students</h3>
            {isLoading ? (
                <p>Loading students from the blockchain...</p>
            ) : students.length === 0 ? (
                <p>No students have been registered yet.</p>
            ) : (
                students.map((student, index) => (
                    <div key={index} className="certificate-card">
                        <p><strong>Student ID:</strong> {student.id}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Status:</strong> {student.isRegistered ? "Registered" : "Not Registered"}</p>
                        
                        {/* Display password hash and edit button */}
                        {editMode === student.id ? (
                            <div className="password-edit-form">
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button onClick={() => handlePasswordChange(student.id)}>Save</button>
                                <button onClick={() => setEditMode(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="password-display">
                                <p>
                                    <strong>Password Hash:</strong> 
                                    <span className="hash-value">{student.passwordHash.substring(0, 10)}...</span>
                                </p>
                                <button onClick={() => setEditMode(student.id)}>Edit Password</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </>
    );
}

export default ViewStudents;