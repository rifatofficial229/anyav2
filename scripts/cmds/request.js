module.exports = {
	config: {
		name: "request",
		version: "1.0",
		author: "RIFAT",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Kiểm tra thông tin nhóm",
			en: "Check group information"
		},
		longDescription: {
			vi: "Kiểm tra thông tin nhóm và trạng thái phê duyệt",
			en: "Check group information and approval status"
		},
		category: "system",
		guide: {
			vi: "Sử dụng lệnh /request để kiểm tra thông tin nhóm",
			en: "Use the /request command to check group information"
		}
	},

	langs: {
		vi: {
			verifying: "🔍 𝐘êu cầu nhận được: Đang xác minh ID nhóm...",
			groupInfo: "🔒 𝐓𝐡𝐨̂𝐧𝐠 𝐭𝐢𝐧 𝐧𝐡𝐨́𝐦:\n╰‣𝐓𝐞̂𝐧: %1\n╰‣𝐀𝐝𝐦𝐢𝐧𝐬: %2\n╰‣𝐓𝐡𝐚̀𝐧𝐡 𝐯𝐢𝐞̂𝐧: %3 (🙋‍♀️ %4 / 🙋 %5)\n╰‣𝐓𝐫𝐚̣𝐧𝐠 𝐭𝐡𝐚́𝐢 𝐭𝐡𝐚𝐦 𝐠𝐢𝐚: %6\n╰‣𝐋𝐨𝐚̣𝐢: %7\n╰‣𝐂𝐡𝐞̂́ 𝐝𝐨̣̂ 𝐩𝐡𝐞̂ 𝐝𝐮𝐲𝐞̣̂𝐭: %8\n╰‣𝐁𝐨𝐭 𝐜𝐨́ 𝐭𝐡𝐞̂̉ 𝐭𝐫𝐚̉ 𝐥𝐨̛̀𝐢: %9\n╰‣𝐋𝐢𝐧𝐤: %10\n\n%11",
			approved: "✅ 𝐍𝐡𝐨́𝐦 𝐧𝐚̀𝐲 𝐯𝐮̛𝐨̛̣𝐭 𝐪𝐮𝐚 𝐩𝐡𝐞̂ 𝐝𝐮𝐲𝐞̣̂𝐭...",
			notApproved: "❌ 𝐍𝐡𝐨́𝐦 𝐧𝐚̀𝐲 𝐜𝐡𝐮̛𝐚 đ𝐮̛𝐨̛̣𝐜 𝐩𝐡𝐞̂ 𝐝𝐮𝐲𝐞̣̂𝐭..."
		},
		en: {
			verifying: "🔍 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐑𝐞𝐜𝐞𝐢𝐯𝐞𝐝: Verifying Group ID...",
			groupInfo: "🔒 𝐆𝐫𝐨𝐮𝐩 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:\n╰‣𝐍𝐚𝐦𝐞: %1\n╰‣𝐀𝐝𝐦𝐢𝐧𝐬: %2\n╰‣𝐌𝐞𝐦𝐛𝐞𝐫𝐬: %3 (🙋‍♀️ %4 / 🙋 %5)\n╰‣𝐉𝐨𝐢𝐧𝐞𝐝 𝐒𝐭𝐚𝐭𝐮𝐬: %6\n╰‣𝐓𝐲𝐩𝐞: %7\n╰‣𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥 𝐌𝐨𝐝𝐞: %8\n╰‣𝐂𝐚𝐧 𝐁𝐨𝐭 𝐑𝐞𝐩𝐥𝐲: %9\n╰‣𝐋𝐢𝐧𝐤: %10\n\n%11",
			approved: "✅ 𝐓𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐛𝐞𝐞𝐧 𝐚𝐩𝐩𝐫𝐨𝐯𝐞𝐝...",
			notApproved: "❌ 𝐓𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐡𝐚𝐬 𝐧𝐨𝐭 𝐛𝐞𝐞𝐧 𝐚𝐩𝐩𝐫𝐨𝐯𝐞𝐝..."
		}
	},

	onStart: async function ({ api, event, getLang }) {
		const approvedFile = "./approved.json";

		// Ensure approved.json exists
		if (!fs.existsSync(approvedFile)) {
			fs.writeFileSync(approvedFile, JSON.stringify([]));
		}

		// Load approved groups
		const approvedGroups = JSON.parse(fs.readFileSync(approvedFile, "utf-8"));
		const groupId = event.threadID;

		// Notify the group about the verification process
		api.sendMessage(getLang("verifying"), groupId);

		// Fetch group information
		const groupInfo = await api.getThreadInfo(groupId);
		const adminCount = groupInfo.adminIDs.length;
		const memberCount = groupInfo.participantIDs.length;
		const femaleCount = groupInfo.userInfo.filter(user => user.gender === 1).length;
		const maleCount = groupInfo.userInfo.filter(user => user.gender === 2).length;
		const approvalMode = groupInfo.approvalMode ? "true" : "false";
		const joinedStatus = groupInfo.isSubscribed ? "✅ Joined" : "❌ Not Joined";
		const type = groupInfo.isGroup ? "GROUP" : "INBOX";
		const canReply = groupInfo.canReply ? "✅ Yes" : "❌ No";
		const link = groupInfo.isGroup ? `https://m.me/j/${groupInfo.threadKey}/ ✅` : "N/A";

		// Determine approval status
		const approvalStatus = approvedGroups.includes(groupId) 
			? getLang("approved") 
			: getLang("notApproved");

		// Send group information
		api.sendMessage(
			getLang(
				"groupInfo",
				groupInfo.name,
				adminCount,
				memberCount,
				femaleCount,
				maleCount,
				joinedStatus,
				type,
				approvalMode,
				canReply,
				link,
				approvalStatus
			),
			groupId
		);
	}
};
