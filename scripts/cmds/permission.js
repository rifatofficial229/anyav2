const fs = require("fs");

const permissionStateFile = "./permissionState.json";
const approvedFile = "./approved.json";

module.exports = {
  config: {
    name: "permission",
    version: "1.0",
    author: "Rifat",
    countDown: 5,
    role: 2, // Only admins or owners can toggle permission
    waitTime: 60000, // Time before leaving the group (in milliseconds)
    supportLink: "https://m.me/j/AbbCTo1VZ6TSDI6E/", // Support group link
    shortDescription: {
      vi: "Bật hoặc tắt kiểm tra quyền sử dụng bot",
      en: "Toggle bot permission checks"
    },
    longDescription: {
      vi: "Bật hoặc tắt tính năng kiểm tra quyền sử dụng bot trong nhóm",
      en: "Toggle the bot's permission check feature in groups"
    },
    category: "system",
    guide: {
      vi: "/permission on để bật kiểm tra quyền\n/permission off để tắt kiểm tra quyền",
      en: "/permission on to enable permission checks\n/permission off to disable permission checks"
    }
  },

  langs: {
    vi: {
      noPermission: "Bot này không có quyền sử dụng trong nhóm này. Bot sẽ rời khỏi nhóm sau 1 phút.\nSử dụng /support để tham gia nhóm hỗ trợ: %1",
      leaveMessage: "Rời khỏi nhóm do không có quyền sử dụng bot.",
      permissionOn: "✅| Đã bật kiểm tra quyền sử dụng bot.",
      permissionOff: "⛔| Đã tắt kiểm tra quyền sử dụng bot."
    },
    en: {
      noPermission: "This bot does not have permission to be used in this group. The bot will leave the group in 1 minute.\nUse /support to join the support group: %1",
      leaveMessage: "Leaving the group due to lack of permission.",
      permissionOn: "✅| Permission checks have been enabled.",
      permissionOff: "⛔| Permission checks have been disabled."
    }
  },

  onStart: async function ({ api, event, args, getLang }) {
    const { threadID, messageID } = event;

    // Ensure the permission state file exists
    if (!fs.existsSync(permissionStateFile)) {
      fs.writeFileSync(permissionStateFile, JSON.stringify({ enabled: true }));
    }

    // Parse the permission state
    const permissionState = JSON.parse(fs.readFileSync(permissionStateFile, "utf-8"));

    if (args[0] === "on") {
      permissionState.enabled = true;
      fs.writeFileSync(permissionStateFile, JSON.stringify(permissionState, null, 2));
      return api.sendMessage(getLang("permissionOn"), threadID, messageID);
    }

    if (args[0] === "off") {
      permissionState.enabled = false;
      fs.writeFileSync(permissionStateFile, JSON.stringify(permissionState, null, 2));
      return api.sendMessage(getLang("permissionOff"), threadID, messageID);
    }

    // If no arguments, proceed with permission enforcement if enabled
    if (permissionState.enabled) {
      // Ensure approved.json exists
      if (!fs.existsSync(approvedFile)) {
        fs.writeFileSync(approvedFile, JSON.stringify([]));
      }

      // Load approved groups
      const approvedGroups = JSON.parse(fs.readFileSync(approvedFile, "utf-8"));

      // Check if the group is approved
      if (!approvedGroups.includes(threadID)) {
        // Notify the group and leave after the configured wait time
        api.sendMessage(getLang("noPermission", this.config.supportLink), threadID, () => {
          setTimeout(() => {
            api.sendMessage(getLang("leaveMessage"), threadID, () => {
              api.removeUserFromGroup(api.getCurrentUserID(), threadID);
            });
          }, this.config.waitTime);
        });
      }
    }
  }
};
