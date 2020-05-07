const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(!message.member.permissions.has("MUTE_MEMBERS")) return message.reply("You do not have permission to un-mute people.");
	//Get the mentioned user, either mention or full ID
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	//If no specified @ user mention, return error to user
	if(!toMute) return message.reply("You did not specify a user mention to un-mute!");

	//Attempt to find pre-exsisting role of "Muted"
	let role = message.guild.roles.cache.find(r => r.name === "Muted");
	//If no role, assume role is deleted and therefore the user is not muted, return message
	if(!role || !toMute.roles.cache.has(role.id)) return message.reply(`sorry ${toMute} is not muted.`);

	await toMute.roles.remove(role);
	delete bot.mutes[toMute.id];

	console.log(`I have un-muted ${toMute.user.tag}.`);

	let adminChannel = message.guild.channels.cache.filter(c=>c.id == bot.guildSettings[message.guild.id].adminchannel).first();
	let muteEmbed = new Discord.MessageEmbed()
		.setDescription("--- **UN-MUTED:** ---")
		.setColor("#0099CC")
		.addField("Unmuted user:", `${toMute} with ID of ${toMute.id}`)
		.addField("Unmuted by:", `${message.author}`)
		.addField("Time:", message.createdAt)
	adminChannel.send(muteEmbed);

	message.reply(`I have un-muted ${toMute} for you.`);
	return;
}

module.exports.help = {
	name: "unmute",
	type: "command",
	desc: "Un-mutes a specified user.",
	example: "!unmute [@user]"
}
