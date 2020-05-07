module.exports.run = async (bot, message, args) => {
	let totalSeconds = (bot.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	let hours = Math.floor((totalSeconds - (days * 86400)) / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${math.Round(seconds)} seconds`;

	message.reply(`The bot has been up for: ${uptime}\n(since last restart - most likley a forced Discord shard reconnect)`);
}

module.exports.help = {
	name: "uptime",
	type: "command",
	desc: "Displays the uptime of the bot.",
	example: "!uptime"
}
