module.exports.run = async (bot, message, args) => {
	//Checking permissions of user requesting mute
	if(bot.authusers[message.member.id].announce != 1) return message.reply(`You do not have permission to do this. Requires: Global announce permissions.`);

	args[0] = args.join(" ");

	console.log(`${message.author} says: ${args[0]}`);

	bot.guilds.cache.forEach(async guild => {
		let channel = guild.channels.cache.get(bot.guildSettings[guild.id].defaultchannel);

		channel.send(`${message.author} says: ${args[0]}\n*This message will remain until deleted by an admin.*`);
	});
	//message.author

}

module.exports.help = {
	name: "announce",
	type: "command",
	desc: "Announces to every server the bot is in. Used for maintenance and notifications. Only @khaoz is able to use this command.",
	example: "!announce [message]"
}
