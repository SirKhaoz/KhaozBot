module.exports.run = async (bot, message, args) => {
	if(message.member.guild.id == '444260557319569439'){
		return message.reply("The !inthebin command is banned on " + message.guild.name);
	}

	if(!message.member.permissions.has("MUTE_MEMBERS") && message.member.id != "78306944179245056") {
		let msg = await message.reply("You do not have permission to do this.");
		msg.delete(7000).catch(err => console.log(err));
		return;
	}

	let voicechannelIDs = message.guild.channels.cache.filter(c=>c.type === 'voice').sort((a, b) => a.calculatedPosition - b.calculatedPosition).map(c=>c);
	if(voicechannelIDs[0] == null) return message.reply("There are no voice channels to tourette lock to, please make one first");

	let togiverole;

	if(!args[0]){
		togiverole = message.guild.member(message.author)
	}else{
		togiverole = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
		if(!togiverole) {
			let msg = await message.reply("You did not specify a valid user mention (use @user or leave blank to put yourself in the bin).");
			msg.delete({timeout:7000}).catch(err => console.log(err));
			return;
		}
	}

	let role = message.guild.roles.cache.find(r => r.name === "In The Bin");

	if(!role){
		try{
			role = await message.guild.roles.create({
				data:{
					name: "In The Bin",
					color: "#ff0000",
					permissions: []
				},
				reason:"Created to put people in the bin."
			});

			message.guild.channels.cache.forEach(async (channel, id) => {
				if(channel.id != bot.guildSettings[togiverole.guild.id].touretteschannel && channel.type === 'voice'){
					await channel.createOverwrite(role, {
						CONNECT: false,
						SPEAK: false
					});
				}
			});
		}catch(e){
			console.log(e.stack);
		}

	}

	if(togiverole.roles.cache.has(role.id)){
		await togiverole.roles.remove(role);
		message.reply(`Aight, I hve removed ${togiverole} from the bin.`);
	} else {
		await togiverole.roles.add(role);
		if (togiverole.voice.channelID != null && (togiverole.voice.channelID != bot.guildSettings[togiverole.guild.id].touretteschannel) && (togiverole.voice.channelID != bot.guildSettings[togiverole.guild.id].afkchannel)){
			togiverole.voice.setChannel(bot.guildSettings[togiverole.guild.id].touretteschannel);
		}
		message.reply(`I have put ${togiverole} in the bin.`);
	}
}

module.exports.help = {
	name: "inthebin",
	type: "static",
	desc: "Places someone in the bin!",
	example: "!inthebin [@user]"
}
