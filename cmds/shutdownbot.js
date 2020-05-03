module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(bot.authusers[message.member.id].admin != 1) return message.reply(`You do not have permission to do this. Requires: Global **ADMIN** permissions.`);

    // send channel a message that you're resetting bot [optional]
    message.reply('Shutting down the bot now. Remember there is no way to reboot now without virtual access to console.')
    .then(msg => bot.destroy())
}

module.exports.help = {
	name: "shutdownbot",
	type: "static",
	desc: "Shuts down the bot completely, but safely.",
	example: "!shutdownbot"
}