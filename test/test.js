const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const AMMFactory = artifacts.require("AMMFactory");
const AMMRouter = artifacts.require("AMMRouter");
const AMMPair = artifacts.require("AMMPair");
const WETH9 = artifacts.require("WETH9");
const ERC20Mock = artifacts.require("ERC20Mock");

contract("AMM", ([deployer, user]) => {
  let factory, router, weth, tokenA, tokenB, deadline;
  const toBN = web3.utils.toBN;

  before(async () => {
    weth = await WETH9.new();
    factory = await AMMFactory.new(deployer);
    router = await AMMRouter.new(factory.address, weth.address);
    tokenA = await ERC20Mock.new("Token A", "TKA", user, web3.utils.toWei("10000"));
    tokenB = await ERC20Mock.new("Token B", "TKB", user, web3.utils.toWei("10000"));
  });

  beforeEach(async () => {
    await tokenA.approve(router.address, web3.utils.toWei("10000"), { from: user });
    await tokenB.approve(router.address, web3.utils.toWei("10000"), { from: user });

    const now = (await web3.eth.getBlock("latest")).timestamp;
    deadline = now + 3600;
  });

  it("adds liquidity and performs token swap", async () => {
    await router.addLiquidity(
      tokenA.address,
      tokenB.address,
      web3.utils.toWei("1000"),
      web3.utils.toWei("1000"),
      0,
      0,
      user,
      deadline,
      { from: user }
    );

    const amountIn = web3.utils.toWei("100");
    const initialTokenB = toBN(await tokenB.balanceOf(user));

    await tokenA.transfer(user, amountIn, { from: user });
    await tokenA.approve(router.address, amountIn, { from: user });

    await router.swapExactTokensForTokens(
      amountIn,
      0,
      [tokenA.address, tokenB.address],
      user,
      deadline,
      { from: user }
    );

    const finalTokenB = toBN(await tokenB.balanceOf(user));
    expect(finalTokenB).to.be.bignumber.gt(initialTokenB);
  });

  it("adds liquidity ETH with tokenA", async () => {
    const amountToken = web3.utils.toWei("100");
    const amountETH = web3.utils.toWei("1");

    await tokenA.approve(router.address, amountToken, { from: user });

    await router.addLiquidityETH(
      tokenA.address,
      amountToken,
      0,
      0,
      user,
      deadline,
      { from: user, value: amountETH }
    );

    const pairAddress = await factory.getPair(tokenA.address, weth.address);
    const pair = await AMMPair.at(pairAddress);
    const balance = await pair.balanceOf(user);
    expect(toBN(balance)).to.be.bignumber.gt(new BN(0));
  });

  it("adds liquidity ETH with tokenB", async () => {
    const amountToken = web3.utils.toWei("200");
    const amountETH = web3.utils.toWei("1");

    await tokenB.approve(router.address, amountToken, { from: user });

    await router.addLiquidityETH(
      tokenB.address,
      amountToken,
      0,
      0,
      user,
      deadline,
      { from: user, value: amountETH }
    );

    const pairAddress = await factory.getPair(tokenB.address, weth.address);
    const pair = await AMMPair.at(pairAddress);
    const balance = await pair.balanceOf(user);
    expect(toBN(balance)).to.be.bignumber.gt(new BN(0));
  });

  it("swaps ETH to token", async () => {
    const path = [weth.address, tokenA.address];
    const amountIn = web3.utils.toWei("1");

    const initialTokenA = toBN(await tokenA.balanceOf(user));

    await router.swapExactETHForTokens(
      0,
      path,
      user,
      deadline,
      { from: user, value: amountIn }
    );

    const finalTokenA = toBN(await tokenA.balanceOf(user));
    expect(finalTokenA).to.be.bignumber.gt(initialTokenA);
  });

  it("swaps token to token", async () => {
    const path = [tokenA.address, weth.address, tokenB.address];
    const amountIn = web3.utils.toWei("10");

    await tokenA.approve(router.address, amountIn, { from: user });
    const initialTokenB = toBN(await tokenB.balanceOf(user));

    await router.swapExactTokensForTokens(
      amountIn,
      0,
      path,
      user,
      deadline,
      { from: user }
    );

    const finalTokenB = toBN(await tokenB.balanceOf(user));
    expect(finalTokenB).to.be.bignumber.gt(initialTokenB);
  });

  it("removes liquidity", async () => {
    const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
    const pair = await AMMPair.at(pairAddress);
    const liquidity = await pair.balanceOf(user);

    const initialTokenA = toBN(await tokenA.balanceOf(user));
    const initialTokenB = toBN(await tokenB.balanceOf(user));

    await pair.approve(router.address, liquidity, { from: user });

    await router.removeLiquidity(
      tokenA.address,
      tokenB.address,
      liquidity,
      0,
      0,
      user,
      deadline,
      { from: user }
    );

    const finalTokenA = toBN(await tokenA.balanceOf(user));
    const finalTokenB = toBN(await tokenB.balanceOf(user));
    const finalLiquidity = await pair.balanceOf(user);

    expect(finalTokenA).to.be.bignumber.gt(initialTokenA);
    expect(finalTokenB).to.be.bignumber.gt(initialTokenB);
    expect(toBN(finalLiquidity)).to.be.bignumber.eq(new BN(0));
  });

  it("removes liquidity ETH", async () => {
    const pairAddress = await factory.getPair(tokenA.address, weth.address);
    const pair = await AMMPair.at(pairAddress);
    const liquidity = await pair.balanceOf(user);

    const initialTokenA = toBN(await tokenA.balanceOf(user));

    await pair.approve(router.address, liquidity, { from: user });

    await router.removeLiquidityETH(
      tokenA.address,
      liquidity,
      0,
      0,
      user,
      deadline,
      { from: user }
    );

    const finalTokenA = toBN(await tokenA.balanceOf(user));
    const finalLiquidity = await pair.balanceOf(user);

    expect(finalTokenA).to.be.bignumber.gt(initialTokenA);
    expect(toBN(finalLiquidity)).to.be.bignumber.eq(new BN(0));
  });
});
