# Custom AMM DEX – Uniswap V2 Style (Solidity, Hardhat, Truffle, Ignition)

This project implements a Automated Market Maker (AMM) similar to Uniswap V2. It includes:

- AMMFactory: Creates and tracks AMM pairs
- AMMRouter: Handles liquidity addition/removal and token swaps
- AMMPair: Core logic for token pools using constant product formula
- WETH9: Wrapped Ether contract
- ERC20Mock: For testing with mock tokens

---

## 🛠 Tech Stack

- **Solidity** (`^0.8.x`)
- **Hardhat** for compilation and Ignition-based deployments
- **Truffle** for Web3.js-based test cases
- **Web3.js** for EVM interaction

---

## 📦 Setup

```bash
git clone https://github.com/madhankarky707/AMM.git
cd AMM
npm install
```

---

## 🚀 Deployment (Hardhat Ignition)

> This project uses Hardhat Ignition to deploy contracts.

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy Contracts

```bash
npx hardhat ignition deploy ./ignition/modules/AMMModule.js --network hardhat
```

This deploys:
- `WETH9`
- `AMMFactory` (with deployer)
- `AMMRouter` (linked to `factory` + `weth`)