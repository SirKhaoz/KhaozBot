module.exports.run = async (bot, message, args) => {
	let mentioned = message.mentions.users.first()
	//let mmessage = (mentioned == null) ? `<@${message.author.id}> says:` : `<@${message.author.id}> says:`
	message.channel.send(`<@${message.author.id}> says:`, {files: [{
		attachment: `./resources/Memes/Stonks/paperhands`,
		name: `PAPERHANDS.PNG`
	}]});
}

module.exports.help = {
	name: "paperhands",
	type: "static",
	desc: "Meme: Paper hands",
	example: "!paperhands"
}
