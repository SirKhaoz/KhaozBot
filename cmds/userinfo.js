const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
	let embed = new Discord.RichEmbed()
		.setAuthor(message.author.username)
		.setDescription("This is the user's info!")
		.setColor("#9B59B6")
		.addField("Full Username", message.author.tag)
		.addField("ID", message.author.id)
		.addField("Created At", message.author.createdAt);

	message.channel.send({embed: embed});

	return;
}

module.exports.help = {
	name: "userinfo",
	type: "command",
	desc: "Displays information about the user, or specified user.",
	example: "!userinfo *or* !userinfo [@user]"
}