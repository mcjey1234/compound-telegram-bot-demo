// compound.js
require('dotenv').config();
const { ethers } = require('ethers');

// Connect to Ethereum via Infura
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Example: cDAI token contract on mainnet
const cDAI_ADDRESS = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";
const cDAI_ABI = [
  "function supplyRatePerBlock() view returns (uint256)"
];

// Function to calculate APY from Compound
async function getMarketAPY() {
  try {
    const cDAI = new ethers.Contract(cDAI_ADDRESS, cDAI_ABI, provider);
    const ratePerBlock = await cDAI.supplyRatePerBlock();

    // Convert BigNumber to number and calculate APY
    const blocksPerDay = 6570;          // ~Ethereum blocks per day
    const daysPerYear = 365;
    const ratePerDay = (ratePerBlock / 1e18) * blocksPerDay;
    const apy = ((Math.pow((1 + ratePerDay), daysPerYear) - 1) * 100).toFixed(2);

    return `${apy}%`;
  } catch (err) {
    console.error("Error fetching APY:", err);
    return "N/A";
  }
}

module.exports = { getMarketAPY, provider };
