module.exports.run = async (bot, message, args) => {
	let totalSeconds = (bot.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = totalSeconds % 60;

	let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

	message.reply(`The bot has been up for: ${uptime}\n(since last restart)`);
}

module.exports.help = {
	name: "uptime",
	type: "command",
	desc: "Displays the uptime of the bot.",
	example: "!uptime"
}