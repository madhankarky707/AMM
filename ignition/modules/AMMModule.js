const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AMMModule", (m) => {
  // Deploy WETH contract
  const weth = m.contract("WETH9");

  // Deploy Factory with deployer address
  const factory = m.contract("AMMFactory", [m.getAccount(0)]);

  // Deploy Router with factory and weth addresses
  const router = m.contract("AMMRouter", [factory, weth]);

  return { weth, factory, router };
});
