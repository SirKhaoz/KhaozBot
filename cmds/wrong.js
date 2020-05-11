module.exports.run = async (bot, message, args) => {
	let mentioned = message.mentions.users.first()
	let mmessage = (mentioned == null) ? `<@${message.author.id}> says:` : `<@${message.author.id}> says: ${mentioned}, you are WRONG.`
	return message.channel.send(`https://giphy.com/gifs/election2016-donald-trump-election-2016-3oz8xLd9DJq2l2VFtu\n
${mmessage}`);
}

module.exports.help = {
	name: "wrong",
	type: "static",
	desc: "You. Are. WRONG.",
	example: "!wrong *or* !wrong [@mention]"
}
