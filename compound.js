require('dotenv').config();
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const TOKENS = {
  cDAI: {
    address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    abi: ["function supplyRatePerBlock() view returns (uint256)"]
  }
};

async function getMarketAPY(tokenName = 'cDAI') {
  try {
    if (!TOKENS[tokenName]) throw new Error(`Token ${tokenName} not supported`);

    const { address, abi } = TOKENS[tokenName];
    const cToken = new ethers.Contract(address, abi, provider);

    const ratePerBlockBN = await cToken.supplyRatePerBlock();
    const ratePerBlock = parseFloat(ethers.formatUnits(ratePerBlockBN, 18));

    const blocksPerDay = 6570;
    const daysPerYear = 365;
    const ratePerDay = ratePerBlock * blocksPerDay;
    const apy = (Math.pow(1 + ratePerDay, daysPerYear) - 1) * 100;

    return `${apy.toFixed(4)}%`;
  } catch (err) {
    console.error("Error fetching APY:", err.message);
    return "N/A";
  }
}

module.exports = { getMarketAPY, provider, TOKENS };
