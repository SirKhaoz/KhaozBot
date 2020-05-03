module.exports.run = async (bot, message, args) => {
	return message.reply("https://giphy.com/gifs/election2016-donald-trump-election-2016-3oz8xLd9DJq2l2VFtu");
}

module.exports.help = {
	name: "wrong",
	type: "static",
	desc: "You. Are. WRONG.",
	example: "!wrong"
}