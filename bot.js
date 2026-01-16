// bot.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { getMarketAPY } = require('./compound');

if (!process.env.TELEGRAM_TOKEN) {
  console.error("Error: TELEGRAM_TOKEN is missing in your .env file!");
  process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply('Welcome to Compound Mini Bot Demo!'));

bot.command('apy', async (ctx) => {
  const apy = await getMarketAPY();
  ctx.reply(`Current APY for cDAI: ${apy}`);
});

bot.launch();
console.log('Bot is running...');
