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
cd amm-dex
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

---

## 🧪 Run Tests (Truffle + Web3.js)

We use `truffle test` with `web3.js` to test the contracts.

### Run all tests:

```bash
truffle test
```

Test cases include:

- ✅ `addLiquidity` (token-token)
- ✅ `addLiquidityETH`
- ✅ `swapExactETHForTokens`
- ✅ `swapExactTokensForTokens`
- ✅ `removeLiquidity`
- ✅ `removeLiquidityETH`

---

## 🧪 Example Hardhat Network Configuration

```js
// hardhat.config.js
require("@nomicfoundation/hardhat-ignition");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
```

---

## 🔍 File Structure

```
contracts/
  - AMMFactory.sol
  - AMMRouter.sol
  - AMMPair.sol
  - WETH9.sol
  - ERC20Mock.sol

test/
  - AMM.test.js  // Using Web3.js + Truffle

ignition/
  modules/
    - AMMModule.js  // Deployment script
```