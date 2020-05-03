const botSettings = require("../resources/keys.json");

module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(bot.authusers[message.member.id].admin != 1) return message.reply(`You do not have permission to do this. Requires: *Global* **ADMIN** permissions.`);

    // send channel a message that you're resetting bot [optional]
    message.reply('Resetting the bot now...')
    .then(m => bot.destroy())
    .then(m => bot.login(botSettings.token))
		.then(m => {
			bot.users.cache.get('78306944179245056').send("Restarted bot, probably by yourself.")
		});

}

module.exports.help = {
	name: "resetbot",
	type: "static",
	desc: "Resets the bot.",
	example: "!resetbot"
}
