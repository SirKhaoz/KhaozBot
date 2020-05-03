module.exports.run = async (bot, message, args) => {
	if(!args[0]) args[0] = 1;

	let songstoskip = args[0]-1;

	if(!bot.musicguilds[message.guild.id].isPlaying){
		let msg = await message.channel.send("There is no music playing.");
		msg.delete({timeout: 7000});
		return;
	}
	if(/[^\d]/.test(songstoskip)) return message.channel.send("Please specify a valid number, of songs to remove.");

	bot.musicguilds[message.guild.id].dispatcher.end();
	message.reply(" the song has been skipped.")
	bot.guildSettings[message.guild.id].queue.splice(0, songstoskip);
	
}

module.exports.help = {
	name: "skip",
	type: "music",
	desc: "Skips the current song playing (if music is playing).",
	example: "!skip"
}