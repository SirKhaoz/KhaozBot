module.exports.run = async (bot, message, args) => {
	let msg = await message.channel.send("Generating avatar...");
	let target = message.mentions.users.first() || message.author;

	await message.channel.send({files: [
		{
			attachment: target.displayAvatarURL,
			name:"avatar.gif"
		}
	]});

	msg.delete();
}

module.exports.help = {
	name: "avatar",
	type: "static",
	desc: "Display's the user, or spcified user's avatar.",
	example: "!avatar *or* !avatar [@user]"
}