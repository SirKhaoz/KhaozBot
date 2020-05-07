const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
	let infouser = (message.mentions.users.first() == null) ? message.author : message.mentions.users.first()

	let embed = new Discord.MessageEmbed()
		.setAuthor(infouser.username)
		.setDescription("Showing the user's info ")
		.setColor("#9B59B6")
		.addField("Full Username:", infouser.tag)
		.addField("ID:", infouser.id)
		.addField("User account was created at:", infouser.createdAt);

	message.channel.send(embed);
}

module.exports.help = {
	name: "userinfo",
	type: "command",
	desc: "Displays information about the user, or specified user.",
	example: "!userinfo *or* !userinfo [@user]"
}
