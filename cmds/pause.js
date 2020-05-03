module.exports.run = async (bot, message, args) => {
	if(!bot.musicguilds[message.guild.id].isPlaying){
		let msg = await message.reply("No Music is playing.");
		msg.delete({timeout: 7000});
		return;
	}

	if (bot.musicguilds[message.guild.id].isPaused) {
		bot.musicguilds[message.guild.id].dispatcher.resume();
		bot.musicguilds[message.guild.id].isPaused = !bot.musicguilds[message.guild.id].isPaused;
		let msg = await message.reply("Music has been resumed.");
		msg.delete({timeout: 14000});
	} else {
		bot.musicguilds[message.guild.id].dispatcher.pause(true);
		bot.musicguilds[message.guild.id].isPaused = !bot.musicguilds[message.guild.id].isPaused;
		let msg = await message.reply("Music has been paused.");
		msg.delete({timeout: 14000});
	}
	
}

module.exports.help = {
	name: "pause",
	type: "music",
	desc: "Pauses current playing music.",
	example: "!pause"
}