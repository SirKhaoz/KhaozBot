module.exports.run = async (bot, message, args) => {
	let totalSeconds = (bot.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	let hours = Math.floor((totalSeconds - (days * 86400)) / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${Math.round(seconds)} seconds`;

	message.reply(`The bot has been up for: ${uptime} (since last restart)\n This restart was most likley a forced-by-Discord shard reconnect.`);
}

module.exports.help = {
	name: "uptime",
	type: "static",
	desc: "Displays the uptime of the bot.",
	example: "!uptime"
}
