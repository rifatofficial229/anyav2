const axios = require('axios');

// Define a sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// To keep track of ongoing fights
const ongoingFights = new Map();

module.exports = {
  config: {
    name: "fight",
    aliases: ["fight"],
    version: "2.0",
    author: "Rifat",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
      en: "Challenge another player to a fight!",
    },
    longDescription: {
      en: "Two players fight until one of them is knocked out. The winner earns coins and experience!",
    },
    guide: {
      en: `
Usage:
- {pn} <@opponent> - Start a fight
`,
    },
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions, threadID } = event;

    // Check if a fight is ongoing in the thread
    if (ongoingFights.has(threadID)) {
      return message.reply("A fight is already ongoing in this thread. Wait for it to finish or stop it first.");
    }

    // Ensure an opponent is mentioned
    if (Object.keys(mentions).length === 0) {
      return message.reply("You need to tag someone to challenge them to a fight!");
    }

    const opponentID = Object.keys(mentions)[0];
    if (opponentID === senderID) {
      return message.reply("You can't fight yourself!");
    }

    // Fetch player data
    const player1 = await usersData.get(senderID);
    const player2 = await usersData.get(opponentID);

    // Initialize fight stats
    let health1 = 100;
    let health2 = 100;
    let turn = 1;

    const moves = [
      { name: "Punch", minDamage: 5, maxDamage: 25 },
      { name: "Kick", minDamage: 5, maxDamage: 25 },
      { name: "Headbutt", minDamage: 5, maxDamage: 25 },
      { name: "Body Slam", minDamage: 5, maxDamage: 25 },
      { name: "Uppercut", minDamage: 5, maxDamage: 25 },
    ];

    const getRandomDamage = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Store fight data
    ongoingFights.set(threadID, { player1: { id: senderID, health: health1 }, player2: { id: opponentID, health: health2 } });

    let fightLog = `🎮 **Fight Log** 🎮\n\n`;

    while (health1 > 0 && health2 > 0) {
      if (!ongoingFights.has(threadID)) {
        return; // Fight was stopped
      }

      const move = moves[Math.floor(Math.random() * moves.length)];
      const damage = getRandomDamage(move.minDamage, move.maxDamage);

      if (turn === 1) {
        health2 -= damage;
        health2 = Math.max(0, health2);
        fightLog += `👊 Player 1 used **${move.name}** and dealt **${damage}** damage! Opponent's health: ${health2}\n`;
        turn = 2;
      } else {
        health1 -= damage;
        health1 = Math.max(0, health1);
        fightLog += `🤜 Player 2 used **${move.name}** and dealt **${damage}** damage! Opponent's health: ${health1}\n`;
        turn = 1;
      }

      await sleep(1000);
    }

    ongoingFights.delete(threadID); // End the fight

    const winnerID = health1 > 0 ? senderID : opponentID;
    const loserID = health1 > 0 ? opponentID : senderID;
    const winnerName = health1 > 0 ? "Player 1" : "Player 2";

    // Update winner's stats
    const winnerData = await usersData.get(winnerID);
    const updatedCoins = parseFloat(winnerData.money || "0") + 100;
    const updatedExp = parseFloat(winnerData.exp || "0") + 20;
    await usersData.set(winnerID, { money: updatedCoins.toString(), exp: updatedExp.toString() });

    fightLog += `\n🎉 **${winnerName} wins the fight!** 🎉\n`;
    fightLog += `💰 Winner earned **100 coins**!\n`;
    fightLog += `⭐ Winner gained **20 experience points**!\n`;

    message.reply(fightLog);
  },
};
