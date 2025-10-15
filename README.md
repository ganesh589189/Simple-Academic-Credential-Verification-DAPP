

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
