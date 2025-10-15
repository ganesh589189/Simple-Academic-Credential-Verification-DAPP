<<<<<<< HEAD


# 🎓 Tokenized Academic Credential Verification DApp

A decentralized application (DApp) built on Ethereum to **issue and verify academic credentials** securely using blockchain technology. This ensures **tamper-proof** and **trustless** storage of educational records. Built using **Solidity**, **React + Vite**, **Ethers.js**, and deployed on the **Ganache** local Ethereum network.

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite  
- **Smart Contract Language**: Solidity  
- **Blockchain Network**: Ganache (Local Ethereum Blockchain)  
- **Ethereum Library**: Ethers.js  
- **Wallet Integration**: MetaMask  
- **Development Tools**: Hardhat, VS Code  

---

## ✨ Features

- ✅ **Issue Credentials**
  - Institution (any connected wallet) can issue credentials to students.
  
- 🔍 **Verify Credentials**
  - Students can view their own issued academic records.

- 🔐 **Privacy and Security**
  - Each user can only view their own credentials (based on wallet address).

- 🧾 **Immutable Record Keeping**
  - All credentials are stored on-chain and are immutable once issued.

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
Step-1: git clone https://github.com/SaiCharanTej-K/Simple-Academic-Credential-Verification-DAPP
Step-2: cd Academic-Credential-Verification-DApp
Step-3: npm install
```

### 2️⃣ Set Up Ganache

- Open **Ganache** and start a new workspace or Quickstart Ethereum.
- Alternatively, you can start Ganache CLI using the command:

```bash
ganache-cli -p 7545
```

- Ensure demo accounts are imported to MetaMask in the Ganache Test Network.

### 3️⃣ Compile and Deploy the Smart Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

### 4️⃣ Start the React App

```bash
cd client
npm run dev
```

- Make sure you give permissions to access through your local host port by confirming access via MetaMask.
![image](https://github.com/user-attachments/assets/14acc26b-a8dc-4315-91b2-51e329a43f59)
![image](https://github.com/user-attachments/assets/132bd242-0217-45a7-ac95-effc7e6aec2f)
![image](https://github.com/user-attachments/assets/ce7499b0-2054-4f5c-a77e-496747bd5905)




---
>>>>>>> 514e256302196280c4bbba87cc48b5cfb09c46d9
=======
**Blockchain for Secure Academic Credential Verification**

This is a decentralized application (DApp) that leverages blockchain technology to provide a secure, transparent, and tamper-proof system for issuing and verifying academic credentials. The platform eliminates the risk of fraudulent certificates by storing a cryptographic hash of each credential on the Ethereum blockchain, while the physical document is securely hosted on the InterPlanetary File System (IPFS).

**Key Features**
Immutable Credential Issuance: University administrators can issue academic certificates with unique, cryptographically secure hashes that are permanently stored on the blockchain.

Decentralized File Storage: All certificate documents are uploaded and hosted on IPFS, ensuring that files are distributed, censorship-resistant, and easily accessible via a unique Content Identifier (CID).

Secure User Authentication: The system features three distinct user roles with secure, password-hashed logins:

**Admin (University):** Responsible for registering students, issuing new certificates, and managing user accounts.

**Student:** Can securely log in to their profile to view and access their issued certificates and other academic records.

**Employee (Recruiter):** Can instantly verify the authenticity of a student's certificate by searching its unique hash on the blockchain.

Cryptographic Verification: The core of the platform is a smart contract that verifies a certificate's authenticity by matching its unique hash against the immutable record on the blockchain. Any alteration to the document would result in a verification failure.

Responsive and Thematic UI: The application's user interface is designed with a modern, academic theme that reflects the prestige of a university while incorporating high-tech, blockchain-inspired elements.

**Technologies Used:**

Frontend: React.js+Vite, HTML, CSS

Blockchain: Ethereum (Ganache for local development)

Smart Contracts: Solidity

Web3.js Library: Ethers.js

Decentralized Storage: IPFS (via Pinata)

Development Environment: Hardhat
>>>>>>> 36a06c23d5b5af02510e954f26c59a8cd00bd43b
