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
