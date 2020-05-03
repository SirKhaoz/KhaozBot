const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	//Checking permissions:
	if(!message.member.permissions.has("MUTE_MEMBERS")) return message.reply("You do not have permission to unmute.");

	//Get the mentioned user, return if there is none.
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if(!toMute) return message.reply("You did not specify a user mention!");

	let role = message.guild.roles.cache.find(r => r.name === "Muted");
	
	if(!role || !toMute.roles.has(role.id)) return message.reply(`sorry ${toMute} is not muted.`);

	await toMute.removeRole(role);
	delete bot.mutes[toMute.id];

	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
		if(err) throw err;
		console.log(`I have unmuted ${toMute.user.tag}.`);
	});

	let adminChannel = message.guild.channels.cache.filter(c=>c.id == bot.guildSettings[message.guild.id].adminchannel).first();
	let muteEmbed = new Discord.RichEmbed()
		.setDescription("--- UNMUTED: ---")
		.setColor("#0099CC")
		.addField("Unmuted user:", `${toMute} with ID of ${toMute.id}`)
		.addField("Unmuted by:", `${message.author}`)
		.addField("Time:", message.createdAt)
	adminChannel.send(muteEmbed);

	message.reply(`I have unmuted ${toMute} for you.`);
	return;
}

module.exports.help = {
	name: "unmute",
	type: "command",
	desc: "Unmutes a specified user.",
	example: "!unmute [@user]"
}