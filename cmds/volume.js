module.exports.run = async (bot, message, args) => {
	if(args[0]=="default"){
		if(!args[1] || /[^\d]/.test(args[1]) || args[1] > 30 || args[1] < 1) {
			let msg = await message.channel.send("Please enter a valid number between 1-30");
			msg.delete({timeout:7000});
			return;
		};

		bot.guildSettings[message.guild.id].botVolume = `${(args[1]/100)}`;

		let msg = await message.reply(`Default volume changed to ${args[1]}.`);
		msg.delete({timeout:7000});
		return;
	}
	if(!args[0] || /[^\d]/.test(args[0]) || args[0] > 30 || args[0] < 1) {
		let msg = await message.channel.send("Please enter a valid number between 1-30");
		msg.delete({timeout:7000});
		return;
	}
	if(!bot.musicguilds[message.guild.id].isPlaying){
		let msg = await message.channel.send("No bot is currently playing music.");
		msg.delete({timeout:7000});
		return;
	}

	bot.musicguilds[message.guild.id].dispatcher.setVolume((args[0]/100));
	bot.guildSettings[message.guild.id].botVolume = (args[0]/100);

	let msg = await message.channel.send(`Set volume to ${args[0]}.`);
	msg.delete({timeout:7000});
}

module.exports.help = {
	name: "volume",
	type: "music",
	desc: "Changes the volume of the bot (default volume or current playing volume).",
	example: "!volume [# 1-30] *or* !volume default [# 1-30]"
}
