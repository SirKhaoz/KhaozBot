module.exports.run = async (bot, message, args) => {
	let mentioned = message.mentions.users.first()
	//let mmessage = (mentioned == null) ? `<@${message.author.id}> says:` : `<@${message.author.id}> says:`
	message.channel.send(`**A List of Memes:**\n!stonks\n!diamondhands\n!paperhands\n!gmeprofits`)
}

module.exports.help = {
	name: "memes",
	type: "static",
	desc: "A list of memes",
	example: "!memes"
}
