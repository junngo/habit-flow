# HabitFlow
HabitFlow is a blockchain-based habit management system that helps users build consistent habits through daily check-ins and rewards them with SPL tokens. This project leverages the Solana blockchain to record user activities and automate rewards distribution.

# 📂 Project Structure

```
habit-flow/
├── backend/       # NestJS backend server
├── frontend/      # Next.js frontend web application
├── blockchain/    # Solana smart contract code
├── shared/        # Shared utilities, types, and constants
└── README.md      # Project documentation
```

### 1. backend/
REST API server for managing data and blockchain interactions.
Handles check-in records, rewards distribution, and user data.
Technologies: Node.js, NestJS, MongoDB.

### 2. frontend/
Web application providing the user interface for HabitFlow.
Allows users to check in and view their progress and rewards.
Integrates Phantom Wallet for wallet authentication.
Technologies: Next.js, Tailwind CSS, Phantom Wallet SDK.

### 3. blockchain/
Contains Solana smart contract code for managing rewards and token distribution.
Includes Devnet test programs for SPL token issuance.
Technologies: Solana CLI, Rust, Anchor Framework.

### 4. shared/
Common utilities, types, and constants used across the project.
Includes API clients and token utilities.


# 🚀 Key Features

1. Daily Check-ins: Users can record their attendance by clicking a daily check-in button.

2. Rewards Distribution: Users receive SPL token rewards for consistent daily check-ins.

3. Wallet Integration: Connect to Phantom Wallet for secure user authentication and transactions.

4. Data Dashboard: Real-time display of user check-in history and rewards.

5. Future Expandability: Designed to integrate features like NFTs, DeFi, and mobile app support.


# 🛠️ Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Phantom Wallet SDK

### Backend
- Node.js
- Express.js
- MongoDB
- Solana Web3.js

### Blockchain
- Solana (SPL tokens)
- Anchor Framework
- Devnet testing environment

# 📌 Roadmap

1. MVP Development:
- Complete core features: check-ins and reward distribution.
- Collect feedback from initial users.
2. Deposit Model Integration:
- Allow users to set goals and manage deposits with penalty logic.
3. Expand Rewards Utility:
- Enable SPL tokens to be used for coupon exchanges and service payments.
4. Community Building:
- Add leaderboards and social features to foster collaboration and competition.
5. Mobile App Launch:
- Develop and release iOS and Android apps.


# 🌱 Getting Started

1. Clone the Repository

2. Set Up Each Directory

## Backend

1. Navigate to the backend/ directory:
```
cd backend
```


2. Install dependencies:
```
npm install
```

3. Start the server:
```
pnpm run start:dev
```
