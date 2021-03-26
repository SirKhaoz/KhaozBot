module.exports.run = async (bot, message, args) => {
	let mentioned = message.mentions.users.first()
	//let mmessage = (mentioned == null) ? `<@${message.author.id}> says:` : `<@${message.author.id}> says:`
	message.channel.send(`<@${message.author.id}> says:`, {files: [{
		attachment: `./resources/Memes/Stonks/diamondhands`,
		name: `DIAMONDHANDS.PNG`
	}]});
}

module.exports.help = {
	name: "diamondhands",
	type: "static",
	desc: "Meme: Diamond hands",
	example: "!diamondhands"
}
