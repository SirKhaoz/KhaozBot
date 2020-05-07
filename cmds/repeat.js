module.exports.run = async (bot, message, args) => {
	if(!args[0]) {
		let replyRepeat = (bot.guildSettings[message.guild.id].repeat) ? "on" : "off";
		return await message.reply(`Repeat is: ${replyRepeat}.`).then(msg => msg.delete({timeout:7000}));
	}
	else if(args[0] == "on"){
		bot.guildSettings[message.guild.id].repeat = true;
	}
	else if(args[0] == "off"){
		bot.guildSettings[message.guild.id].repeat = false;
	}
	else{
		return await message.reply("Please enter a valid value for this command. [on/off]").then(msg => msg.delete({timeout:7000}));
		msg.delete({timeout:7000});
	}
	message.reply(`repeat is now ${args[0]}.`);
}

module.exports.help = {
	name: "repeat",
	type: "music",
	desc: "Continues to repeat song untill stopped. Or displays current repeat status.",
	example: "!repeat [on/off] *or* !repeat"
}
