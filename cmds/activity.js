const Discord = module.require("discord.js");
const authusers = require("../resources/authorisedusers.json");
const botmisc = require("../resources/botmiscsettings.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	if(authusers[message.member.id].activity != 1) return message.reply(`You do not have permission to do this. Requires: Global activity permissions.`);

	args[0] = args.join(" ");

	bot.user.setActivity(args[0]);
	bot.miscsettings.activity = args[0];

	await fs.writeFileSync("./resources/botmiscsettings.json", JSON.stringify(bot.miscsettings, null, 1), err => {
		if(err) throw err;
		console.log(`I have written the misc settings to file.`);
	});

	let msg = await message.reply(" changed the activity, just for you x");
	msg.delete(14000);
	
}

module.exports.help = {
	name: "activity",
	type: "command",
	desc: "Changes the activity for the bot. Only special people are allowed to use this.",
	example: "!activity [activity]"
}