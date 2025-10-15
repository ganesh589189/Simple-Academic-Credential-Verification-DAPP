// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; // Ensure this matches your Hardhat config

import "@openzeppelin/contracts/access/Ownable.sol";

contract Credential is Ownable {
    // A separate struct for student accounts
    struct Student {
        string studentId;
        string name;
        bytes32 passwordHash; // Store the hash of the password
        bool isRegistered;
    }

    // Main struct for certificates
    struct Certificate {
        string studentId;
        string name;
        string branch;
        string dept;
        string cgpa;
        string ipfsHash;
        string issuedDate;
        address issuer;
    }

    // Mappings to store data
    mapping(bytes32 => Certificate) private credentials;
    bytes32[] private issuedHashes;
    mapping(string => Student) private students;
    string[] private registeredStudentIds;

    // --- CONSTRUCTOR ---
    // The constructor now takes an initialOwner and passes it to the Ownable constructor.
    constructor(address initialOwner) Ownable(initialOwner) {}

    // --- EVENTS ---
    event CredentialIssued(bytes32 indexed credentialHash, string studentId, address indexed issuer);
    event StudentRegistered(string studentId);
    event StudentPasswordUpdated(string studentId);

    // --- UTILITY FUNCTIONS ---
    function _calculateCertHash(
        string memory studentId,
        string memory name,
        string memory cgpa,
        string memory issuedDate,
        address issuer
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(studentId, name, cgpa, issuedDate, issuer));
    }

    // --- STUDENT REGISTRATION & MANAGEMENT FUNCTIONS ---
    function registerStudent(string memory _studentId, string memory _name, bytes32 _passwordHash) public onlyOwner {
        require(bytes(students[_studentId].studentId).length == 0, "Student already registered.");
        students[_studentId] = Student(_studentId, _name, _passwordHash, true);
        registeredStudentIds.push(_studentId);
        emit StudentRegistered(_studentId);
    }
    
    function updateStudentPassword(string memory _studentId, bytes32 _newPasswordHash) public onlyOwner {
        require(bytes(students[_studentId].studentId).length != 0, "Student not found.");
        students[_studentId].passwordHash = _newPasswordHash;
        emit StudentPasswordUpdated(_studentId);
    }
    
    function getStudentPasswordHash(string memory _studentId) public view onlyOwner returns (bytes32) {
        require(bytes(students[_studentId].studentId).length != 0, "Student not found.");
        return students[_studentId].passwordHash;
    }
    
    function getStudent(string memory _studentId) public view returns (string memory, string memory, bool) {
        Student storage student = students[_studentId];
        return (student.studentId, student.name, student.isRegistered);
    }
    
    function getRegisteredStudentIds() public view returns (string[] memory) {
        return registeredStudentIds;
    }
    
    function studentLogin(string memory _studentId, bytes32 _passwordHash) public view returns (bool) {
        Student storage student = students[_studentId];
        return student.isRegistered && student.passwordHash == _passwordHash;
    }
    
    // --- CERTIFICATE ISSUANCE & VERIFICATION FUNCTIONS ---
    function issueCredential(
        string memory studentId,
        string memory name,
        string memory branch,
        string memory dept,
        string memory cgpa,
        string memory _ipfsHash,
        string memory issuedDate
    ) public onlyOwner {
        require(students[studentId].isRegistered, "Student is not registered.");
        bytes32 credentialHash = _calculateCertHash(studentId, name, cgpa, issuedDate, msg.sender);
        require(bytes(credentials[credentialHash].studentId).length == 0, "Credential with this hash already exists.");
        Certificate memory newCert = Certificate({
            studentId: studentId,
            name: name,
            branch: branch,
            dept: dept,
            cgpa: cgpa,
            ipfsHash: _ipfsHash,
            issuedDate: issuedDate,
            issuer: msg.sender
        });
        credentials[credentialHash] = newCert;
        issuedHashes.push(credentialHash);
        emit CredentialIssued(credentialHash, studentId, msg.sender);
    }
    
    function getCredentialByHash(bytes32 credentialHash) public view returns (Certificate memory) {
        return credentials[credentialHash];
    }
    
    function getIssuedHashes() public view returns (bytes32[] memory) {
        return issuedHashes;
    }
}