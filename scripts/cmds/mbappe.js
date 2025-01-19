module.exports = {
	config: {
		name: "mbappe",
		aliases: ["kylian", "mbappe"],
		version: "1.0",
		author: "Rifat",
		countDown: 5,
		role: 0,
		shortDescription: "send you pic of Kylian Mbappé",
		longDescription: "",
		category: "football",
		guide: "{pn}"
	},

	onStart: async function ({ message }) {
		var link = [
			"https://i.imgur.com/AJ1tGjB.jpg",
			"https://i.imgur.com/UKTCgV2.jpg",
			"https://i.imgur.com/MKP21FZ.jpg",
			"https://i.imgur.com/zHlVRoh.jpg",
			"https://i.imgur.com/D6kZBPP.jpg",
			"https://i.imgur.com/OfZ12Kb.jpg",
			"https://i.imgur.com/V2BwGEY.jpg",
			"https://i.imgur.com/ykfK4l8.jpg",
			"https://i.imgur.com/Q6ZObyv.jpg",
			"https://i.imgur.com/3lRHNUn.jpg",
			"https://i.imgur.com/axKXxNr.jpg",
			"https://i.imgur.com/hxTtF7P.jpg",
			"https://i.imgur.com/aiuNPrk.jpg",
			"https://i.imgur.com/oXUeJYJ.jpg",
			"https://i.imgur.com/sX28NR8.jpg"
		];

		let img = link[Math.floor(Math.random() * link.length)];
		message.send({
			body: '「 The Speedster ⚡ Mbappé 」',
			attachment: await global.utils.getStreamFromURL(img)
		});
	}
};
