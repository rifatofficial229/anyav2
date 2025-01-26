module.exports = {
    config: {
        name: "owner",
        version: "1.0",
        author: "Loid Butter",
        countDown: 5,
        role: 0,
        shortDescription: "ask ai who is the bot owner",
        longDescription: "ask ai who is the bot owner",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "owner") return message.reply("Hello! My owner/developer is itz Mueid Mursalin Rifat Ans Co-Owner is  Christan Samontanez Morata this is my owner fb ~    https://www.facebook.com/mueid.mursalin.rifat1  and this is co-owner Fb id  ~ https://www.facebook.com/p/Christan-Samontanez-Morata-100078404143393/ if any help   use /support");
}
};
