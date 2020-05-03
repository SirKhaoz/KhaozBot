module.exports.run = async (bot, message, args) => {
	if(bot.musicguilds[message.guild.id].isPlaying == false){
		let msg = await message.reply("No Music is playing.");
		msg.delete({timeout: 7000});
		return;
	}

	let msg = await message.reply("Stopping play...");
	msg.delete({timeout: 14000});

	bot.guildSettings[message.guild.id].queue = [];
	bot.musicguilds[message.guild.id].isPlaying = false;
	bot.musicguilds[message.guild.id].dispatcher.end();
	bot.musicguilds[message.guild.id].voiceChannel.leave();	
}

module.exports.help = {
	name: "stop",
	type: "music",
	desc: "Stops all current playing music (also clears the queue).",
	example: "!stop"
}