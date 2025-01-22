const allOnEvent = global.GoatBot.onEvent;

const fs = require("fs");
const cron = require("node-cron");
const greetings = {
  morning: [
    { time: "7:00 AM", message: "GOOD MORNING EVERYONE☀️ !! I LOVE Y'ALL, IT'S TIME TO GET UP BRUSH YOUR TEETH CLEANING" },
    { time: "8:30 AM", message: "HEY GUYS, HAVE YOU TAKEN BREAK FAST." },
    { time: "11:40 AM", message: "ENTERTAINMENT, Time to watch TV, what movie would you like to watch, type {pn}movie <movie name> to watch in bot." },
  ],
  lunchtime: [
    { time: "12:00 PM", message: "Good afternoon everyone how have you been ✨" },
    { time: "12:30 PM", message: "Hungry yet? Lunch plans anyone?" },
    { time: "1:00 PM", message: "Lunch break! Who's in for some good food and great company?" },
  ],
  afternoonSnack: [
    { time: "3:00 PM", message: "Time for a snack break! Join me for some treats?" },
    { time: "3:30 PM", message: "Feeling a bit peckish? Snacks and chit-chat await!" },
    { time: "4:00 PM", message: "Afternoon delight: Snacks, laughter, and fun!" },
  ],
  eveningDinner: [
    { time: "6:00 PM", message: "Dinner plans tonight? Let's enjoy a hearty meal together." },
    { time: "8:36 PM", message: "Evening has come, and so has the dinner bell! 🍽️" },
    { time: "9:00 PM", message: "Dinner is served! Who's joining me at the table?" },
  ],
  lateNightSnack: [
    { time: "11:00 PM", message: "Late-night munchies? Come on over for some snacks!" },
    { time: "11:30 PM", message: "Midnight snack run, anyone? Let's satisfy those cravings." },
    { time: "12:00 AM", message: "Burning the midnight oil? Grab a snack and keep me company." },
  ],
};

  module.exports = {
  config: {
    name: "autogreet",
    version: "1.1",
    author: "Rifat",
    description: "Autogreeting",
    category: "events"
  },

onStart: async ({ api, args, message, event, threadsData, usersData, dashBoardData, threadModel, userModel, dashBoardModel, role, commandName }) => {

cron.schedule('0 8 * * *', () => {
  sendRandomGreeting(greetings.morning);
});

cron.schedule('0 12 * * *', () => {
  sendRandomGreeting(greetings.lunchtime);
});

cron.schedule('0 15 * * *', () => {
  sendRandomGreeting(greetings.afternoonSnack);
});

cron.schedule('0 18 * * *', () => {
  sendRandomGreeting(greetings.eveningDinner);
});

cron.schedule('0 23 * * *', () => {
  sendRandomGreeting(greetings.lateNightSnack);
});

function sendRandomGreeting(greetingArray) {
  const randomIndex = Math.floor(Math.random() * greetingArray.length);
  const { time, message } = greetingArray[randomIndex];
  console.log(`[${time}] ${message}`);
}
}
};
