const axios = require('axios');

module.exports = {
  config: {
    name: "imagine",
    version: "1.0",
    author: "RIFAT",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    longDescription: {
      en: "Text to image"
    },
    category: "image",
    guide: {
      en: '{pn} your prompt'
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("Please provide a prompt.");
    }

    message.reply("✅| Creating your Imagination...", async (err, info) => {
      let ui = info.messageID;
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      try {
        const response = await axios.get(`https://zaikyoo.onrender.com/api/ideogramturbo?prompt=${encodeURIComponent(text)}`);
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // Ensure the response contains valid data
        if (!response.data || !response.data.combinedImageUrl) {
          return message.reply("Error: No image data received.");
        }

        const img = response.data.combinedImageUrl;
        if (typeof img !== 'string' || !img.startsWith('http')) {
          return message.reply("Error: Invalid image URL.");
        }

        message.unsend(ui);
        message.reply({
          body: `Here's your imagination 🖼.\nPlease reply with the image number (1, 2, 3, 4) to get the corresponding image in high resolution.`,
          attachment: await global.utils.getStreamFromURL(img)
        }, async (err, info) => {
          let id = info.messageID;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            imageUrls: response.data.imageUrls 
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, event.threadID);
      }
    });
  },

  onReply: async function ({ api, event, Reply, usersData, args, message }) {
    const reply = parseInt(args[0]);
    const { author, messageID, imageUrls } = Reply;
    if (event.senderID !== author) return;

    try {
      if (reply >= 1 && reply <= 4) {
        const img = imageUrls[`image${reply}`];
        if (typeof img !== 'string' || !img.startsWith('http')) {
          return message.reply("Error: Invalid image URL.");
        }
        message.reply({ attachment: await global.utils.getStreamFromURL(img) });
      } else {
        message.reply("Invalid image number. Please reply with a number between 1 and 4.");
        return;
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`Error: ${error.message}`, event.threadID);
    }
    message.unsend(Reply.messageID); 
  },
};
