module.exports.run = async (bot, message, args) => {
	let replyRepeat = "";

	if(!args[0]) {
		if(bot.guildSettings[message.guild.id].repeat) replyRepeat = "on";
		if(!bot.guildSettings[message.guild.id].repeat) replyRepeat = "off";
		let msg = await message.reply(`Repeat is: ${replyRepeat}.`);
		msg.delete(7000);
		return;
	}
	else if(args[0] == "on"){
		bot.guildSettings[message.guild.id].repeat = true;
	}
	else if(args[0] == "off"){
		bot.guildSettings[message.guild.id].repeat = false;
	}
	else{
		let msg = await message.reply("Please enter a valid value for this command. [on/off]");
		msg.delete(7000);
		return;
	}
	
	message.reply(`repeat is now ${args[0]}.`);
}

module.exports.help = {
	name: "repeat",
	type: "music",
	desc: "Continues to repeat song untill stopped. Or displays current repeat status.",
	example: "!repeat [on/off] *or* !repeat"
}